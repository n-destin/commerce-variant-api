import { Router } from "express";
import passport from "passport";
import { AuthController } from "../controllers/Auth.controller";
import { IUser } from "../types/User.type";

const authRouter = Router();
authRouter.get(
 "/signin/google",
 passport.authenticate("google", { scope: ["profile", "email"] }),
);
authRouter.get(
 "/google/redirect",
 passport.authenticate("google"),
 async (req, res, next) => {
  try {
   const authState = await AuthController.socialLogin(req.user as IUser);
   return res.status(200).json(authState);
  } catch (error) {
   return next(error);
  }
 },
);

export default authRouter;
