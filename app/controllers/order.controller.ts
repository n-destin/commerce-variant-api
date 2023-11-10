import { IOrderDto } from "./../types/order.type";
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
import { IOrder, IOrderResponse } from "../types/order.type";
import { Order } from "../database/Order";
import { v4 } from "uuid";
import { Product } from "../database/Product";
import { IProduct } from "../types/product.type";
import { createCheckoutSession } from "../utils/checkoutSession";
import { IUser } from "../types/User.type";

@Tags("Orders")
@Route("api/orders")
export class OrderController extends Controller {
  @Get("/")
  public static async getOrders(
    @Inject() condition: { [key: string]: string } = {},
  ): Promise<IOrderResponse[]> {
    return await Order.find({ ...condition }).populate(["orderer", "product"]);
  }

  @Get("/{orderId}")
  public static async getOrder(
    @Inject() condition: { [key: string]: string } = {},
  ): Promise<IOrderResponse> {
    const order = (
      await Order.findOne({ ...condition }).populate(["orderer", "product"])
    )?.toObject() as IOrderResponse;

    return order;
  }

  @Security("jwtAuth")
  @Post("/")
  public static async createOrder(
    @Inject() user: IUser,
    @Body() order: IOrderDto,
  ): Promise<string | null> {
    const orderRefId = v4();
    const { product: productId } = order;
    const product = (await Product.findById(productId)) as IProduct;
    await Order.create({
      ref_id: orderRefId,
      product: product._id,
      total: 1 * product.price,
      orderer: user._id,
    });
    return await createCheckoutSession(product.name, product.price, user.email);
  }

  @Security("jwtAuth")
  @Delete("{orderId}")
  public static async deleteOrder(@Path() orderId: string): Promise<string> {
    await Order.deleteOne({ _id: orderId });
    return "Deleted successful";
  }

  @Security("jwtAuth")
  @Put("/{orderId}")
  public static async updateOrder(
    @Path() orderId: string,
    @Body() order: IOrderDto,
  ): Promise<IOrder> {
    const updated = (await Order.findOneAndUpdate(
      { _id: orderId },
      { $set: order },
      { new: true },
    )) as IOrder;
    return updated;
  }
}
