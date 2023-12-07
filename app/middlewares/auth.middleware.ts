import { NextFunction } from "express";
import { Request, Response } from "express";
import { User } from "../database/User";

export const userExist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(409).send({ message: "User Already Exists" });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while checking the user",
    });
  }
};
