import { Request, Response } from "express";
import { Route, Controller, Get, Tags, Security, Inject } from "tsoa";
import { IProductResponse } from "../types/product.type";
import { IUser } from "../types/User.type";
import { IOrderResponse } from "../types/order.type";
import { Product } from "../database/Product";
import { User } from "../database/User";
import { Order } from "../database/Order";
import { IStatistic, IStatisticOverview } from "../types/statistic.types";
import { Purpose } from "../database/Purpose";
import { College } from "../database/College";
import { Stats } from "fs";
import { OrderController } from "./order.controller";

@Tags("Statistics")
@Route("api/statistics")
export class StatisticsController extends Controller {
  @Security("jwtAuth")
  @Get("/")
  public static async getOverview(
    @Inject() user: string,
    @Inject() isAdmin: boolean = false,
    @Inject() dateCondition: Record<string, any> = {},
  ): Promise<IStatistic> {
    const myProducts = await Product.find({ owner: user });
    const myProductsIds = myProducts.map((product) => product._id);
    const sellOrdersOngoing = await Order.countDocuments({
      product: { $in: myProductsIds },
      paymentStatus: "PAID",
      deliveryStatus: "NOT_YET_DELIVERED",
      ...dateCondition,
    });
    const ordersOngoing = await Order.countDocuments({
      orderer: user,
      paymentStatus: "PAID",
      deliveryStatus: "NOT_YET_DELIVERED",
      ...dateCondition,
    });
    const sellOrders = await Order.countDocuments({
      product: { $in: myProductsIds },
      paymentStatus: "PAID",
      ...dateCondition,
    });
    const orders = await Order.countDocuments({
      orderer: user,
      paymentStatus: "PAID",
      ...dateCondition,
    });

    const purposes = await Purpose.find();
    const rentPurposes = purposes
      .filter((purpose) => purpose.slug.includes("RENT"))
      .map((purpose) => purpose._id);
    const donatePurposes = purposes
      .filter((purpose) => purpose.slug.includes("DONAT"))
      .map((purpose) => purpose._id);
    const rentProducts = await Product.countDocuments({
      owner: user,
      purpose: { $in: rentPurposes },
    });
    const donateProducts = await Product.countDocuments({
      owner: user,
      purpose: { $in: donatePurposes },
    });
    const sales = await Order.aggregate([
      {
        $match: {
          product: { $in: myProductsIds },
          paymentStatus: "PAID",
          ...dateCondition,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
        },
      },
    ]);
    const purchases = await Order.aggregate([
      {
        $match: {
          orderer: user,
          paymentStatus: "PAID",
          ...dateCondition,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
        },
      },
    ]);

    const overview = [
      { slug: "PRODUCTS", number: myProducts.length, link: "products" },
      { slug: "SELLER_ORDERS", number: sellOrders, link: "orders" },
      { slug: "PURCHASE_ORDERS", number: orders, link: "orders" },
      { slug: "ONGOING_SALES", number: sellOrdersOngoing, link: "orders" },
      { slug: "ONGOING_PURCHASES", number: ordersOngoing, link: "orders" },
      { slug: "RENT_PRODUCTS", number: rentProducts, link: "products" },
      { slug: "DONATE_PRODUCTS", number: donateProducts, link: "products" },
      { slug: "SALES", number: sales.length ? sales[0].total : 0, link: "" },
      {
        slug: "PURCHASES",
        number: purchases.length ? purchases[0].total : 0,
        link: "",
      },
    ];
    const stat: IStatistic = {};
    stat.transactions = (await OrderController.getUserOrders(
      user,
      5,
    )) as IOrderResponse[];

    if (isAdmin) {
      const colleges = await College.countDocuments();
      const users = await User.countDocuments();
      const adminoverview = [
        { slug: "USERS", number: users, link: "" },
        { slug: "COLLEGES", number: colleges, link: "" },
      ];
      overview.concat(adminoverview);
    }
    stat.overview = overview;

    return stat;
  }

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
