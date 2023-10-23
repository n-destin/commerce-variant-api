import express, { NextFunction, Request, Response } from "express";
import { CategoryController } from "../controllers/category.controller";
import passport from "passport";

const categoryRouter = express.Router();

categoryRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
 try {
  const categoriesList = await CategoryController.getAllCategories();
  return res.status(200).json(categoriesList);
 } catch (error) {
  return next(error);
 }
});
categoryRouter.post(
 "/",
 passport.authenticate("jwt", { session: false }),
 async (req: Request, res: Response, next: NextFunction) => {
  try {
   const createdCategory = await CategoryController.createCategory(req.body);
   return res.status(201).json(createdCategory);
  } catch (error) {
   return next(error);
  }
 },
);
export default categoryRouter;
