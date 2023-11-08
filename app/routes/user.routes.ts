import express, { NextFunction, Request, Response } from "express";
import { UserController } from "../controllers/User.controller";
import { IUser } from "../types/User.type";
import passport from "passport";

const userRouter = express.Router();
userRouter.use(passport.authenticate("jwt", { session: false }));
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
userRouter.put(
  "/college/:college",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const college = req.params.college;
      const profile = await UserController.attachCollege(req.user as IUser, college);
      return res.status(200).json(profile);
    } catch (error) {
      return next(error);
    }
  },
);
export default userRouter;
