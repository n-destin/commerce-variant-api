import { Route, Controller, Get, Tags, Inject } from "tsoa";
import { IProduct, IProductResponse } from "../types/product.type";
import { Product } from "../database/Product";
import { Purpose } from "../database/Purpose";

@Tags("Rent Products")
@Route("api/rent-products")
export class RentProductsController extends Controller {
  @Get("/")
  public static async getRentProducts(
    @Inject() limit: number = 0,
  ): Promise<IProductResponse[]> {
    const regex = new RegExp("rent", "i");
    const purpose = await Purpose.findOne({ name: regex });
    let products = limit
      ? await Product.find({ purpose: purpose, isAvailable: true })
          .limit(limit)
          .sort({ createdAt: -1 })
          .exec()
      : await Product.find({ purpose: purpose, isAvailable: true });
    return (await Product.populate(products, [
      { path: "condition" },
      { path: "purpose" },
    ])) as unknown as IProductResponse[];
  }
}