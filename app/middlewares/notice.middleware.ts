import { NextFunction } from "express";
import { Request, Response } from "express";
import { Notice } from "../database/Notice";

export const checkNotice = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.noticeId as string;
  try {
    const notice = await Notice.findById({ _id: id });
    if (!notice) {
      return res.status(400).json({
        message: "No Notice found ",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while checking the notice",
    });
  }
};