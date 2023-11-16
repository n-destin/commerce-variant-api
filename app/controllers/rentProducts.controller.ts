import { Route, Controller, Get, Tags } from "tsoa";
import { IProductResponse } from "../types/product.type";
import { Product } from "../database/Product";
import { Purpose } from "../database/Purpose";

@Tags("Rent Products")
@Route("api/rent-products")
export class RentProductsController extends Controller {
  @Get("/")
  public static async getRentProducts(): Promise<IProductResponse[]> {
    const regex = new RegExp("rent", "i");
    const purpose = await Purpose.findOne({ name: regex });
    return await Product.find({ purpose: purpose, isAvailable: true }).populate([
      "category",
      "condition",
    ]);
  }
}
