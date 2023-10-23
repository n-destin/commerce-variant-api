import express, { NextFunction, Request, Response } from "express";
import { UserController } from "../controllers/User.controller";
import { IUser } from "../types/User.type";
import passport from "passport";

const userRouter = express.Router();

userRouter.get(
 "/profile",
 passport.authenticate("jwt", { session: false }),
 async (req: Request, res: Response, next: NextFunction) => {
  try {
   const profile = await UserController.getMyProfile(req.user as IUser);
   return res.status(200).json(profile);
  } catch (error) {
   return next(error);
  }
 },
);
export default userRouter;
