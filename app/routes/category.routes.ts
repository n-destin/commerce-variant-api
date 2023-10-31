import express, { NextFunction, Request, Response } from "express";
import { CategoryController } from "../controllers/category.controller";
import passport from "passport";
import { checkCategory } from "../middlewares/category.middleware";

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

categoryRouter.put(
  "/:id", checkCategory,
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updateCategory = await CategoryController.updateCategory(req.params.id, req.body);
      return res.status(200).json(updateCategory);
    } catch (error) {
      return next(error);
    }
  },
);

categoryRouter.delete(
  "/:id", checkCategory,
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleteCategory = await CategoryController.deleteCategory(req.params.id);
      return res.status(200).json(deleteCategory);
    } catch (error) {
      return next(error);
    }
  },
);



export default categoryRouter;
