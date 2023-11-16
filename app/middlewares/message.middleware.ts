import { NextFunction } from "express";
import { Request, Response } from "express";
import { Message } from "../database/Message";

export const checkMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.messageId as string;
  try {
    const message = await Message.findOne().or([{ _id: id }, { id: id }]);

    if (!message) {
      return res.status(400).json({
        message: "No message found ",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while checking the message",
    });
  }
};
