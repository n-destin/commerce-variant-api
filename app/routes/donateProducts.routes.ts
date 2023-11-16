import express, { Request, Response } from "express";
import { DonateProductsController } from "../controllers/donateProducts.controller";

const donateProductsRouter = express.Router();

donateProductsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const products = await DonateProductsController.getDonateProducts();
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

export default donateProductsRouter;
