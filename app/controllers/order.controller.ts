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
import CustomError from "../utils/CustomError";

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
    return await createCheckoutSession(
      product.name,
      product.price,
      user.email,
      orderRefId,
      product._id,
    );
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
  @Get("/{refId}/status")
  public static async updateStatus(@Path() refId: string, @Inject() status: string) {
    const order = await Order.findOne({ ref_id: refId });
    if (!order) {
      throw new CustomError("Order not found", 400);
    }
    await Order.findByIdAndUpdate(order._id, { paymentStatus: status });
    await Product.findByIdAndUpdate(order.product, { isAvailable: false });
  }
  @Get("/seller/{id}")
  public static async getSellersOrders(@Path() id: string): Promise<unknown> {
    const products = await Product.find({ owner: id }).select("_id");
    const productIds = products.map((product) => product._id);
    const orders = await Order.find({
      product: { $in: productIds },
      paymentStatus: "PAID",
    }).populate("product");
    return orders;
  }
  @Get("/buyer/{id}")
  public static async getBuyerOrders(@Path() id: string): Promise<unknown> {
    const orders = await Order.find({
      orderer: id,
      paymentStatus: "PAID",
    }).populate("product");
    return orders;
  }
}
