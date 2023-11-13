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
  IProduct,
  IProductFilter,
  IProductResponse,
  ISingleProductResponse,
  ProductDto,
} from "../types/product.type";
import { Product } from "../database/Product";
import { College } from "../database/College";

@Tags("Products")
@Route("api/products")
export class ProductController extends Controller {
  @Get("/")
  public static async getProducts(
    @Inject() condition: { [key: string]: string } = {},
  ): Promise<IProductResponse[]> {
    return await Product.find({ ...condition, isAvailable: true }).populate([
      "category",
      "condition",
    ]);
  }

  @Post("/filter")
  public static async filterProducts(
    @Body() filter: IProductFilter,
    @Inject() condition: { [key: string]: any } = {},
  ): Promise<any[]> {
    const { categories, colleges } = filter;
    if (categories && categories.length > 0) {
      condition.category = { $in: categories };
    }

    const data = (await Product.find({ ...condition, isAvailable: true })
      .populate({ path: "owner", select: "college" })
      .populate(["category", "condition"])) as IProductResponse[];

    if (colleges && colleges.length > 0) {
      const filteredProducts = data.filter((product) => {
        const collegeId = product?.owner?.college?.toString();
        return collegeId !== undefined && colleges.includes(collegeId);
      });
      return filteredProducts;
    }

    return data;
  }

  @Get("/{productId}")
  public static async getProduct(
    @Inject() condition: { [key: string]: string } = {},
  ): Promise<ISingleProductResponse> {
    const product = (
      await Product.findOne({ ...condition })
        .populate({
          path: "owner",
          populate: {
            path: "college",
          },
        })
        .populate(["category", "condition"])
    )?.toObject() as IProductResponse;

    const similar = (await Product.find({
      category: product?.category,
      _id: { $ne: product._id },
    }).populate(["category", "condition"])) as IProductResponse[];

    return {
      ...product,
      college: product.owner?.college,
      similar,
    };
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
}
