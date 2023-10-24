import express, { NextFunction, Request, Response } from "express";
import { UserController } from "../controllers/User.controller";
import { IUser } from "../types/User.type";
import passport from "passport";
import upload from "../helpers/upload";
import { AssetsController } from "../controllers/Assets.controller";

const assetsRouter = express.Router();
assetsRouter.post(
 "/",
 upload.any(),
 async (req: Request, res: Response, next: NextFunction) => {
  try {
   const response = await AssetsController.uploadAssets(
    req.files as Express.Multer.File[],
   );
   return res.status(200).send(response);
  } catch (error) {
   return next(error);
  }
 },
);
export default assetsRouter;
