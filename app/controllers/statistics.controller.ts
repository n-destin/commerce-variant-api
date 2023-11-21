import { Request, Response } from "express";
import { Route, Controller, Get, Tags, Security, Inject } from "tsoa";
import { IProductResponse } from "../types/product.type";
import { IUser } from "../types/User.type";
import { IOrderResponse } from "../types/order.type";
import { Product } from "../database/Product";
import { User } from "../database/User";
import { Order } from "../database/Order";
import { IStatisticOverview } from "../types/statistic.types";
import { Purpose } from "../database/Purpose";
import { College } from "../database/College";

@Tags("Statistics")
@Route("api/statistics")
export class StatisticsController extends Controller {
  @Security("jwtAuth")
  @Get("/")
  public static async getOverview(
    @Inject() user: string,
    @Inject() isAdmin: boolean = false,
    @Inject() dateCondition: Record<string, any> = {},
  ): Promise<IStatisticOverview[]> {
    const myProducts = await Product.find({ owner: user });
    const myProductsIds = myProducts.map((product) => product._id);
    const sellOrders = await Order.countDocuments({
      product: { $in: myProductsIds },
      deliveryStatus: "NOT_YET_DELIVERED",
      ...dateCondition,
    });
    const orders = await Product.countDocuments({
      orderer: user,
      deliveryStatus: "NOT_YET_DELIVERED",
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

    const stat = [
      { slug: "PRODUCTS", number: myProducts.length, link: "products" },
      { slug: "SELLER_ORDERS", number: sellOrders, link: "orders" },
      { slug: "PURCHASE_ORDERS", number: orders, link: "orders" },
      { slug: "RENT_PRODUCTS", number: rentProducts, link: "products" },
      { slug: "DONATE_PRODUCTS", number: donateProducts, link: "products" },
      { slug: "SALES", number: sales.length ? sales[0].total : 0, link: "" },
      {
        slug: "PURCHASES",
        number: purchases.length ? purchases[0].total : 0,
        link: "",
      },
    ];
    if (isAdmin) {
      const colleges = await College.countDocuments();
      const users = await User.countDocuments();
      const adminStat = [{ slug: "USERS", number: users, link: "" }];
      return stat.concat(adminStat);
    }
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
