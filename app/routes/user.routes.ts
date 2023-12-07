import express, { NextFunction, Request, Response } from "express";
import { UserController } from "../controllers/User.controller";
import { IUser } from "../types/User.type";
import passport from "passport";
import { checkUserExist } from "../middlewares/user.middleware";

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
  "/college",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const college = req.body.college;
      const phone = req.body.phone;
      const profile = await UserController.attachCollege(
        req.user as IUser,
        req.body,
      );
      return res.status(200).json(profile);
    } catch (error) {
      return next(error);
    }
  },
);

userRouter.put(
  "/:userId",
  checkUserExist,
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updateUserProfile = await UserController.updateProfile(
        req.params.userId,
        {
          ...req.body,
        },
      );
      return res.status(200).json(updateUserProfile);
    } catch (error) {
      return next(error);
    }
  },
);

export default userRouter;
