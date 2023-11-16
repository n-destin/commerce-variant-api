import { Route, Controller, Get, Tags } from "tsoa";
import { IProductResponse } from "../types/product.type";
import { Product } from "../database/Product";
import { Purpose } from "../database/Purpose";

@Tags("Donate Products")
@Route("api/donate-products")
export class DonateProductsController extends Controller {
  @Get("/")
  public static async getDonateProducts(): Promise<IProductResponse[]> {
    const regex = new RegExp("Donation", "i");
    const purpose = await Purpose.findOne({ name: regex });
    return await Product.find({ purpose: purpose, isAvailable: true }).populate([
      "category",
      "condition",
    ]);
  }
}
