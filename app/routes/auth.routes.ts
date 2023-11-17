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
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res, next) => {
    try {
      const user = req?.user as IUser;
      if (!user.email.endsWith(".edu")) {
        // Remove ! for this to work
        const authState = await AuthController.socialLogin(req.user as IUser);
        const redirectUrl = `${appConfig.frontEndUrl}/auth/redirect?token=${authState.accessToken}`;
        return res.redirect(redirectUrl);
      } else {
        return res.redirect(`${appConfig.frontEndUrl}/login?error=invalid-email`);
      }
    } catch (error) {
      return next(error);
    }
  },
);
authRouter.get("/error", (req, res) => {
  const error = req.query.error;
  return res.status(403).json({ error: error });
});

export default authRouter;
