import express, { NextFunction, Request, Response } from "express";

import passport from "passport";
import { OrderController } from "../controllers/order.controller";
import { IUser } from "../types/User.type";
import { checkOrder } from "../middlewares/order.middleware";

const orderRouter = express.Router();

orderRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await OrderController.getOrders();
    return res.status(200).json(orders);
  } catch (error) {
    return next(error);
  }
});
orderRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as IUser;
      const createdOrder = await OrderController.createOrder({
        ...req.body,
        orderer: user._id,
      });
      return res.status(201).json(createdOrder);
    } catch (error) {
      return next(error);
    }
  },
);

orderRouter.get(
  "/my-orders",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as IUser;
      const getOrders = await OrderController.getOrders({
        orderer: user._id,
      });
      return res.status(201).json(getOrders);
    } catch (error) {
      return next(error);
    }
  },
);

orderRouter.put(
  "/:orderId",
  checkOrder,
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createdOrder = await OrderController.updateOrder(req.params.orderId, {
        ...req.body,
      });
      return res.status(200).json(createdOrder);
    } catch (error) {
      return next(error);
    }
  },
);

orderRouter.get(
  "/:orderId",
  checkOrder,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await OrderController.getOrder({
        _id: req.params.orderId,
      });
      return res.status(200).json(order);
    } catch (error) {
      return next(error);
    }
  },
);

orderRouter.delete(
  "/:id",
  checkOrder,
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleteCategory = await OrderController.deleteOrder(req.params.id);
      return res.status(200).json(deleteCategory);
    } catch (error) {
      return next(error);
    }
  },
);

export default orderRouter;
