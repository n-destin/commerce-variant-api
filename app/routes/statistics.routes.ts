import express, { Request, Response } from "express";
import { StatisticsController } from "../controllers/statistics.controller";

const statisticsRouter = express.Router();

statisticsRouter.get("/products", async (req: Request, res: Response) => {
  try {
    const products = await StatisticsController.getProducts();
    if (products.length > 0) {
      return res.status(200).json({
        message: "Products found",
        number: products.length,
      });
    } else {
      return res.status(404).json({ message: "No products found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ message: "An error occurred", error: error.toString() });
    }
    return res.status(500).json({ message: "An unknown error occurred" });
  }
});

statisticsRouter.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await StatisticsController.getUsers();
    if (users.length > 0) {
      return res.status(200).json({
        message: "Users found",
        number: users.length,
      });
    } else {
      return res.status(404).json({ message: "No users found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ message: "An error occurred", error: error.toString() });
    }
    return res.status(500).json({ message: "An unknown error occurred" });
  }
});

statisticsRouter.get("/orders", async (req: Request, res: Response) => {
  try {
    const orders = await StatisticsController.getOrders();
    if (orders.length > 0) {
      return res.status(200).json({
        message: "Orders found",
        number: orders.length,
      });
    } else {
      return res.status(404).json({ message: "No orders found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ message: "An error occurred", error: error.toString() });
    }
    return res.status(500).json({ message: "An unknown error occurred" });
  }
});

export default statisticsRouter;