import { NextFunction } from "express";
import { Request, Response } from "express";
import { decodeToken } from "../helpers/user.password";
import { User } from "../database/User";


export const checkUserIdExist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = decodeToken(req.query.token as string).ref
    if (userId) {
      const user = await User.findById({ _id: userId });
      if (!user) {
        return res.status(400).json({
          message: "No User found",
        });
      }

      req.body = {
        ...req.body,
        userId,
      };
      next();
    }
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while checking the user",
    });
  }
};