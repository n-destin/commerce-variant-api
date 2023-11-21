import { NextFunction } from "express";
import { Request, Response } from "express";
import { User } from "../database/User";
import { IUser } from "../types/User.type";

export const checkUserExist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.userId as string;
  const userAuth = req.user as IUser;
  const userId = userAuth._id.valueOf()
  try {
    if (id === userId) {
      const user = await User.findById({ _id: id });
      if (!user) {
        return res.status(400).json({
          message: "No User found",
        });
      }
      next();
    }
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while checking the user",
    });
  }
};
