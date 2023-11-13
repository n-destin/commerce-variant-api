import express, { NextFunction, Request, Response } from "express";
import { ChatController } from "../controllers/chat.controller";
import passport from "passport";
import { checkChat } from "../middlewares/chat.middleware";
import { checkProduct } from "../middlewares/product.middleware";
import { IUser } from "../types/User.type";

const chatRouter = express.Router();

chatRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chats = await ChatController.getAllChats();
    return res.status(200).json(chats);
  } catch (error) {
    return next(error);
  }
});

chatRouter.get(
  "/my-chats",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as IUser;
      const chats = await ChatController.myChats(user._id);
      return res.status(200).json(chats);
    } catch (error) {
      return next(error);
    }
  },
);

chatRouter.get(
  "/:id",
  checkProduct,
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as IUser;
      const chat = await ChatController.getChat(req.params.id, user._id);
      return res.status(201).json(chat);
    } catch (error) {
      return next(error);
    }
  },
);

chatRouter.get(
  "/:id/by-id",
  checkChat,
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const chat = await ChatController.getChatById(req.params.id);
      return res.status(201).json(chat);
    } catch (error) {
      return next(error);
    }
  },
);

chatRouter.put(
  "/:id",
  checkChat,
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updateChat = await ChatController.updateChat(req.params.id, req.body);
      return res.status(200).json(updateChat);
    } catch (error) {
      return next(error);
    }
  },
);

chatRouter.delete(
  "/:id",
  checkChat,
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleteChat = await ChatController.deleteChat(req.params.id);
      return res.status(200).json(deleteChat);
    } catch (error) {
      return next(error);
    }
  },
);

export default chatRouter;
