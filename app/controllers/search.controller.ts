import {
  Route,
  Controller,
  Get,
  Tags,
  Path,
} from "tsoa";
import {
  IProductResponse,
} from "../types/product.type";
import { Product } from "../database/Product";

@Tags("Search")
@Route("api/search")
export class SearchController extends Controller {
  @Get("/{searchQuery}")
  public static async searchProducts(
    @Path() searchQuery: string,
  ): Promise<IProductResponse[]> {
    const regex = new RegExp(searchQuery, 'i'); 
    return await Product.find({ name: regex }).populate(["category", "condition"]);
  }
}