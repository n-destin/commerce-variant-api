import 'reflect-metadata'
import {
  Route,
  Controller,
  Get,
  Tags,
  Security,
  Post,
  Body,
  Put,
  Path,
  Delete,
  Inject,
} from "tsoa";
import {
  IHomepageProduct,
  IProduct,
  IProductFilter,
  IProductLog,
  IProductResponse,
  ISingleProductResponse,
  ProductDto,
} from "../types/product.type";
import { Product } from "../database/Product";
import { Purpose } from "../database/Purpose";
import CustomError from "../utils/CustomError";
import { Order } from "../database/Order";
import { ProductLog } from "../database/ProductLog";
import { RentProductsController } from "./rentProducts.controller";
import { SaleProductsController } from "./saleProducts.controller";
import { User } from "../database/User";
import { plainToClass } from 'class-transformer'

@Tags("Products")
@Route("api/products")
export class ProductController extends Controller {
  @Get("/")
  public static async getProducts(): Promise<IProductResponse[]> {
    const unknownArray : unknown = (await Product.find({ isAvailable: true })
      .populate(["category", "condition", "purpose"])
      .sort({ createdAt: -1 })
      .exec())
      return unknownArray as IProductResponse[];
  }

  @Get("/my-products")
  public static async getMyProducts(
    @Inject() condition: { [key: string]: string } = {},
  ): Promise<IProductResponse[]> {
    const conditionsUnknownArray : unknown = (await Product.find({ ...condition })
      .populate(["category", "condition", "purpose"])
      .sort({ createdAt: -1 })
      .exec());
      return conditionsUnknownArray as IProductResponse[];
  }

  @Post("/filter")
  public static async filterProducts(
    @Body() filter: IProductFilter,
    @Inject() condition: { [key: string]: any } = {},
  ): Promise<IProductResponse[]> {
    const { categories, colleges } = filter;
    if (categories && categories.length > 0) {
      condition.category = { $in: categories };
    }

    const data = (await Product.find({ ...condition, isAvailable: true })
      .populate({ path: "owner", select: "college" })
      .populate(["category", "condition", "purpose"])
      .sort({ createdAt: -1 })
      .exec()) as IProductResponse[];

    if (colleges && colleges.length > 0) {
      const filteredProducts = data.filter(async (product) => {
        const owner = await User.findById(product?.owner)
        const collegeId = owner?.college?.toString();
        return collegeId !== undefined && colleges.includes(collegeId);
      });
      return filteredProducts;
    }
    return data;
  }

  @Get("/{productId}")
  public static async getProduct(
    @Inject() condition: { [key: string]: string } = {},
    @Inject() user: string | undefined,
  ): Promise<ISingleProductResponse> {
    const product = (
      await Product.findOne({ ...condition, isAvailable: true })
        .populate({
          path: "owner",
          populate: {
            path: "college",
          },
        })
        .populate(["category", "condition", "purpose"])
    )?.toObject() as IProductResponse;

    const similar = (await Product.find({
      category: product?.category,
      _id: { $ne: product._id },
      isAvailable: true,
    }).populate(["category", "condition", "purpose"])) as IProductResponse[];
    let isOrdered = false;
    if (user != "") {
      const order = await Order.findOne({
        product: product._id,
        orderer: user,
        paymentStatus: "PAID",
        deliveryStatus: "NOT_YET_DELIVERED",
      });

      if (order) isOrdered = true;
    }

    return {
      ...product,
      college: product.owner?.college,
      similar,
      isOrdered,
    };
  }

  @Get("/{productId}/logs")
  public static async getProductLogs(
    @Inject() productId: string,
  ): Promise<IProductLog[]> {
    const logs = (await ProductLog.find({ product: productId })
      .populate("user")
      .sort({ createdAt: -1 })
      .exec()) as IProductLog[];

    const refineLogs = logs.map((log) => {
      return {
        _id: log._id,
        text: log.text?.replace("__name__", log.user?.displayName || ""),
        createdAt: log.createdAt,
      };
    });

    return refineLogs;
  }

  @Security("jwtAuth")
  @Post("/")
  public static async createProduct(@Body() product: ProductDto): Promise<IProduct> {
    return (await Product.create(product)) as unknown as IProduct;
  }

  @Security("jwtAuth")
  @Delete("{productId}")
  public static async deleteProduct(@Path() productId: string): Promise<string> {
    await Product.deleteOne({ _id: productId });
    return "Deleted successful";
  }

  @Security("jwtAuth")
  @Put("/{productId}")
  public static async updateProduct(
    @Path() productId: string,
    @Body() product: ProductDto,
  ): Promise<IProduct> {
    const updated = (await Product.findOneAndUpdate(
      { _id: productId },
      { $set: product },
      { new: true },
    )) as IProduct;
    return updated;
  }

  @Get("/purpose/{slug}")
  public static async getProductByPurpose(
    @Inject() purposeSlug: string,
  ): Promise<IProductResponse[]> {
    const purpose = await Purpose.findOne({ slug: purposeSlug });
    if (!purpose) {
      throw new CustomError("purpose not found");
    }
    return await Product.find({ purpose: purpose._id }).populate([
      "category",
      "condition",
    ]);
  }

  @Get("/homepage")
  public static async getHomepageProducts(): Promise<IHomepageProduct> {
    const sale = new SaleProductsController();
    const saleProducts = await sale.getSaleProducts(10);
    const otherProducts = await sale.getOtherProducts(5);

    return { sale: saleProducts, other: otherProducts };
  }
}
