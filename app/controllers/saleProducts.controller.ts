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
          .sort({ createdAt: -1 })
          .exec()
      : await Product.find({ purpose: purpose, isAvailable: true });
    const unknownArray : unknown = (await Product.populate(products, [
      { path: "condition" },
      { path: "purpose" },
    ]));
    const toReturn : IProductResponse[] = unknownArray as IProductResponse[];
    return toReturn;
  }

  public async getOtherProducts(
    @Inject() limit: number = 0,
  ): Promise<IProductResponse[]> {
    const regex = new RegExp("sale", "i");
    const purpose = await Purpose.findOne({ name: regex });
    let products = limit
      ? await Product.find({ purpose: { $ne: purpose }, isAvailable: true })
          .limit(limit)
          .sort({ createdAt: -1 })
          .exec()
      : await Product.find({ purpose: purpose, isAvailable: true });
      const unknownArray : unknown = (await Product.populate(products, [
        { path: "condition" },
        { path: "purpose" },
      ]));
      const toReturn : IProductResponse[] = unknownArray as IProductResponse[];
      return toReturn;
  }
}
