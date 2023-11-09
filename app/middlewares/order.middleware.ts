import { NextFunction } from "express";
import { Request, Response } from "express";
import { Order } from "../database/Order";

export const checkOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.orderId as string;
  try {
    const order = await Order.findOne().or([{ _id: id }, { id: id }]);

    if (!order) {
      return res.status(400).json({
        message: "No order found ",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while checking the order",
    });
  }
};
