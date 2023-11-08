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
import { IProduct, IProductResponse, ProductDto } from "../types/product.type";
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
