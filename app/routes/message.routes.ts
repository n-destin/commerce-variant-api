import express, { NextFunction, Request, Response } from "express";
import { MessageController } from "../controllers/message.controller";
import passport from "passport";
import { checkMessage } from "../middlewares/message.middleware";
import { IUser } from "../types/User.type";

const messageRouter = express.Router();

messageRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as IUser;
      const createdMessage = await MessageController.createMessage(
        req.body,
        user._id,
      );
      return res.status(201).json(createdMessage);
    } catch (error) {
      return next(error);
    }
  },
);

messageRouter.put(
  "/:id",
  checkMessage,
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updateMessage = await MessageController.updateMessage(
        req.params.id,
        req.body,
      );
      return res.status(200).json(updateMessage);
    } catch (error) {
      return next(error);
    }
  },
);

messageRouter.delete(
  "/:id",
  checkMessage,
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleteMessage = await MessageController.deleteMessage(req.params.id);
      return res.status(200).json(deleteMessage);
    } catch (error) {
      return next(error);
    }
  },
);

export default messageRouter;
