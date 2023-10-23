import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import { ConditionController } from "../controllers/condition.controller";

const conditionRouter = express.Router();

conditionRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
 try {
  const productConditions = await ConditionController.getConditions();
  return res.status(200).json(productConditions);
 } catch (error) {
  return next(error);
 }
});
conditionRouter.post(
 "/",
 passport.authenticate("jwt", { session: false }),
 async (req: Request, res: Response, next: NextFunction) => {
  try {
   const productCondition = await ConditionController.createCondition(req.body);
   return res.status(201).json(productCondition);
  } catch (error) {
   return next(error);
  }
 },
);
export default conditionRouter;
