import { IOrderConfirm, IOrderDto } from "./../types/order.type";
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
import { OrderCode } from "../database/OrderCode";
import { generateOrderCode } from "../utils/codegenerator";

@Tags("Orders")
@Route("api/orders")
export class OrderController extends Controller {
  @Get("/")
  public static async getOrders(
    @Inject() condition: { [key: string]: string } = {},
  ): Promise<IOrderResponse[]> {
    return await Order.find({ ...condition })
      .populate(["orderer", "product"])
      .populate({
        path: "product",
        populate: {
          path: "owner",
        },
      })
      .populate({
        path: "product",
        populate: {
          path: "purpose",
        },
      });
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
    const product = (await Product.findById(productId).populate(
      "purpose",
    )) as IProduct;
    if (!product) throw new CustomError("Product not found", 400);
    const isDonation = product?.purpose?.slug?.includes("DONAT");
    const quantity =
      product?.purpose?.slug.includes("RENT") && order.days && order.days > 0
        ? order.days
        : 1;
    const total = isDonation ? 0 : quantity * product.price!;
    const paymentStatus = isDonation ? "PAID" : "PENDING";
    await Order.create({
      ref_id: orderRefId,
      product: product._id,
      total: total,
      orderer: user._id,
      days: order.days,
      paymentStatus,
    });
    if (!isDonation) {
      return await createCheckoutSession(
        product.name,
        total,
        user.email,
        orderRefId,
        product._id,
      );
    } else {
      await Product.findByIdAndUpdate(product._id, { isAvailable: false });
      return "created";
    }
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
  @Security("jwtAuth")
  @Get("/code/{id}")
  public static async getOrderCode(@Path() id: string) {
    try {
      const orderCode = await OrderCode.findOne({ order: id });
      const code = orderCode?.code
        ? orderCode.code
        : (await OrderCode.create({ order: id, code: generateOrderCode() })).code;
      return code;
    } catch (error) {
      throw new CustomError("Server error");
    }
  }
  @Post("/confirm")
  public static async confirmOrder(
    @Body() data: IOrderConfirm,
    @Inject() user: IUser,
  ) {
    const order = (await Order.findById(data.orderId)
      .populate(["product"])
      .populate({
        path: "product",
        populate: {
          path: "owner",
        },
      })) as IOrderResponse;
    if (!order) throw new CustomError("Order not found");
    const orderCode = await OrderCode.findOne({ order: data.orderId });
    if (orderCode?.code !== data.code) {
      throw new CustomError("Invalid confirmation code", 400);
    }

    const requester = order.product.owner?._id.toString();
    const owner = user._id.toString();
    console.log(requester, "---", owner);
    if (requester != owner) {
      throw new CustomError("Access Denied", 403);
    }

    await Order.findByIdAndUpdate(order._id, { deliveryStatus: "DELIVERED" });
    return data;
  }
}
