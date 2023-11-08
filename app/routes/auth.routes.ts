import { Router } from "express";
import passport from "passport";
import { AuthController } from "../controllers/Auth.controller";
import { IUser } from "../types/User.type";
import { appConfig } from "../config/app";

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
      const redirectUrl = `${appConfig.frontEndUrl}/auth/redirect?token=${authState.accessToken}`;
      return res.redirect(redirectUrl);
    } catch (error) {
      return next(error);
    }
  },
);

export default authRouter;
