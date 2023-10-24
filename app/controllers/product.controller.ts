import { Category } from "../database/Category";
import { ICategory, ICreateCategory } from "../types/category.type";
import { Route, Controller, Get, Tags, Security, Post, Body } from "tsoa";
import { IProduct, IProductResponse, ProductDto } from "../types/product.type";
import { Product } from "../database/Product";

@Tags("Products")
@Route("api/products")
export class ProductController extends Controller {
 @Get("/")
 public static async getProducts(): Promise<IProductResponse[]> {
  return await Product.find().populate(["category", "condition"]);
 }
 @Security("jwtAuth")
 @Post("/")
 public static async createProduct(@Body() product: ProductDto): Promise<IProduct> {
  return (await Product.create(product)) as unknown as IProduct;
 }
}
