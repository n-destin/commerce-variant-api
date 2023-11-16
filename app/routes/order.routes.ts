import express, { NextFunction, Request, Response } from "express";

import passport from "passport";
import { OrderController } from "../controllers/order.controller";
import { IUser } from "../types/User.type";
import { checkOrder } from "../middlewares/order.middleware";
import { appConfig } from "../config/app";

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
      const createdOrder = await OrderController.createOrder(user, req.body);
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

orderRouter.get(
  "/:refId/status",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const status = req.query.status;
      console.log(status);
      await OrderController.updateStatus(req.params.refId, status as string);
      return res.redirect(`${appConfig.frontEndUrl}/dashboard/orders`);
    } catch (error) {
      return next(error);
    }
  },
);
orderRouter.get(
  "/seller/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const sellerId = req.params.id as string;
    const orders = await OrderController.getSellersOrders(sellerId);
    return res.json(orders);
  },
);
orderRouter.get(
  "/buyer/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const buyerId = req.params.id as string;
    const orders = await OrderController.getBuyerOrders(buyerId);
    return res.json(orders);
  },
);

orderRouter.get(
  "/code/:id",
  passport.authenticate("jwt", { session: false }),
  checkOrder,
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;
    const orderCode = await OrderController.getOrderCode(orderId);
    return res.json(orderCode);
  },
);

export default orderRouter;
