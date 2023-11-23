import { Route, Controller, Get, Tags, Inject } from "tsoa";
import { IProduct, IProductResponse } from "../types/product.type";
import { Product } from "../database/Product";
import { Purpose } from "../database/Purpose";

@Tags("Rent Products")
@Route("api/sale-products")
export class SaleProductsController extends Controller {
  @Get("/")
  public async getSaleProducts(
    @Inject() limit: number = 0,
  ): Promise<IProductResponse[]> {
    const regex = new RegExp("sale", "i");
    const purpose = await Purpose.findOne({ name: regex });
    let products = limit
      ? await Product.find({ purpose: purpose, isAvailable: true })
          .limit(limit)
          .exec()
      : await Product.find({ purpose: purpose, isAvailable: true });
    return (await Product.populate(products, [
      { path: "condition" },
      { path: "purpose" },
    ])) as IProductResponse[];
  }

  public async getOtherProducts(
    @Inject() limit: number = 0,
  ): Promise<IProductResponse[]> {
    const regex = new RegExp("sale", "i");
    const purpose = await Purpose.findOne({ name: regex });
    let products = limit
      ? await Product.find({ purpose: { $ne: purpose }, isAvailable: true })
          .limit(limit)
          .exec()
      : await Product.find({ purpose: purpose, isAvailable: true });
    return (await Product.populate(products, [
      { path: "condition" },
      { path: "purpose" },
    ])) as IProductResponse[];
  }
}
