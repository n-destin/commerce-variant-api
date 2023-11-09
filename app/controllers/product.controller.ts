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
  IProductResponse,
  ISingleProductResponse,
  ProductDto,
} from "../types/product.type";
import { Product } from "../database/Product";

@Tags("Products")
@Route("api/products")
export class ProductController extends Controller {
  @Get("/")
  public static async getProducts(
    @Inject() condition: { [key: string]: string } = {},
  ): Promise<IProductResponse[]> {
    return await Product.find({ ...condition }).populate(["category", "condition"]);
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
      owner: undefined,
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
