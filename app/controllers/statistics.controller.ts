
import { Request, Response } from "express";
import { Route, Controller, Get, Tags, Security } from "tsoa";
import { IProductResponse } from "../types/product.type";
import { IUser } from "../types/User.type";
import { IOrderResponse } from "../types/order.type";
import { Product } from "../database/Product";
import { User } from "../database/User";
import { Order } from "../database/Order";

@Tags("Statistics")
@Route("api/statistics")
export class StatisticsController extends Controller {
  @Security("jwtAuth")
  @Get("/products")
  public static async getProducts(): Promise<IProductResponse[]> {
    return await Product.find({ isAvailable: true }).populate([
      "category",
      "condition",
    ]);
  }

  @Security("jwtAuth")
  @Get("/users")
  public static async getUsers(): Promise<IUser[]> {
    return await User.find({});
  }

  @Security("jwtAuth")
  @Get("/orders")
  public static async getOrders(): Promise<IOrderResponse[]> {
    return await Order.find({}).populate(["orderer", "product"]);
  }
}
