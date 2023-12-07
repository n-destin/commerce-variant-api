import { Router } from "express";
import passport from "passport";
import { AuthController } from "../controllers/Auth.controller";
import { IUser } from "../types/User.type";
import { appConfig } from "../config/app";
import { userValidation } from "../validation/user.validation";
import { NextFunction, Request, Response } from "express";
import { userExist } from "../middlewares/auth.middleware";
import { getValidationResult } from "../validation/result.validation";
import { generateAuthToken } from "../helpers/auth";

const authRouter = Router();
authRouter.get(
  "/signin/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

authRouter.get(
  "/signin/microsoft",
  passport.authenticate("microsoft", {
    prompt: "select_account",
  }),
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

authRouter.get(
  "/microsoft/redirect",
  passport.authenticate("microsoft", { failureRedirect: "/" }),
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

authRouter.post("/signup", userValidation["users"], getValidationResult, userExist, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profileInfo = await AuthController.createProfile(req.body);
    return res.status(200).json(profileInfo);
  } catch (error) {
    return next(error);
  }
});

authRouter.post("/signin", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await AuthController.login(req.body);
    return res.status(user.status).json(user.data);
  } catch (error) {
    return next(error);
  }
});

authRouter.get("/verify/:userId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await AuthController.userVerify(req.params.userId);
    const accessToken = await generateAuthToken(user._id)
    const redirectUrl = `${appConfig.frontEndUrl}/auth/redirect?token=${accessToken}`;
    return res.redirect(redirectUrl);
  } catch (error) {
    return next(error);
  }
});

export default authRouter;
