import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import { PurposeController } from "../controllers/purpose.controller";

const purposeRouter = express.Router();

purposeRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productPurposes = await PurposeController.getPurpose();
    return res.status(200).json(productPurposes);
  } catch (error) {
    return next(error);
  }
});

purposeRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productPurpose = await PurposeController.createPurpose(req.body);
      return res.status(201).json(productPurpose);
    } catch (error) {
      return next(error);
    }
  },
);

purposeRouter.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productPurpose = await PurposeController.updatePurpose(
        req.params.id,
        req.body,
      );
      return res.status(200).json(productPurpose);
    } catch (error) {
      return next(error);
    }
  },
);

purposeRouter.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productPurpose = await PurposeController.deletePurpose(req.params.id);
      return res.status(200).json(productPurpose);
    } catch (error) {
      return next(error);
    }
  },
);

export default purposeRouter;
