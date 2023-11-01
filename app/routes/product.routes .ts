import express, { NextFunction, Request, Response } from "express";

import passport from "passport";
import { ProductController } from "../controllers/product.controller";
import { IUser } from "../types/User.type";
import { checkProduct } from "../middlewares/product.middleware";

const productRouter = express.Router();

productRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await ProductController.getProducts();
    return res.status(200).json(products);
  } catch (error) {
    return next(error);
  }
});
productRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as IUser;
      const createdProduct = await ProductController.createProduct({
        ...req.body,
        owner: user._id,
      });
      return res.status(201).json(createdProduct);
    } catch (error) {
      return next(error);
    }
  },
);

productRouter.put(
  "/:productId", checkProduct,
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createdProduct = await ProductController.updateProduct(req.params.productId, req.body);
      return res.status(200).json(createdProduct);
    } catch (error) {
      return next(error);
    }
  },
);

export default productRouter;
