import { NextFunction } from "express";
import { Request, Response } from "express";
import { Chat } from "../database/Chat";

export const checkChat = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.chatId as string;
  try {
    const chat = await Chat.findOne().or([{ _id: id }, { id: id }]);

    if (!chat) {
      return res.status(400).json({
        message: "No chat found ",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while checking the chat",
    });
  }
};
