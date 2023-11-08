import { NextFunction } from "express";
import { Request, Response } from "express";
import { Product } from "../database/Product";

export const checkProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.productId as string;
  try {
    const product = await Product.findOne().or([{ _id: id }, { id: id }]);

    if (!product) {
      return res.status(400).json({
        message: "No product found ",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while checking the product",
    });
  }
};
