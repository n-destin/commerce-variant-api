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
import { IOrder, IOrderDto, IOrderResponse } from "../types/Order.type";
import { Order } from "../database/Order";

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
  public static async createOrder(@Body() order: IOrderDto): Promise<IOrder> {
    return (await Order.create(order)) as unknown as IOrder;
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
