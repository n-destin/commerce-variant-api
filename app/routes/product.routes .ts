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
        thumbnail: req.body.thumbnail[0],
        gallery: req.body.gallery.map((url: string) => ({ url })),
        owner: user._id,
      });
      return res.status(201).json(createdProduct);
    } catch (error) {
      return next(error);
    }
  },
);

productRouter.get(
  "/my-products",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as IUser;
      const getProducts = await ProductController.getProducts({
        owner: user._id,
      });
      return res.status(201).json(getProducts);
    } catch (error) {
      return next(error);
    }
  },
);

productRouter.put(
  "/:productId",
  checkProduct,
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createdProduct = await ProductController.updateProduct(
        req.params.productId,
        {
          ...req.body,
          thumbnail: req.body.thumbnail[0],
          gallery: req.body.gallery.map((url: string) => ({ url })),
        },
      );
      return res.status(200).json(createdProduct);
    } catch (error) {
      return next(error);
    }
  },
);

productRouter.put(
  "/:id",
  checkProduct,
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log({
        ...req.body,
        thumbnail: req.body.thumbnail[0],
        gallery: req.body.gallery.map((url: string) => ({ url })),
      });
      const updateCategory = await ProductController.updateProduct(req.params.id, {
        ...req.body,
        thumbnail: req.body.thumbnail[0],
        gallery: req.body.gallery.map((url: string) => ({ url })),
      });

      return res.status(200).json({
        ...req.body,
        thumbnail: req.body.thumbnail[0],
        gallery: req.body.gallery.map((url: string) => ({ url })),
      });
    } catch (error) {
      return next(error);
    }
  },
);

productRouter.delete(
  "/:id",
  checkProduct,
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleteCategory = await ProductController.deleteProduct(req.params.id);
      return res.status(200).json(deleteCategory);
    } catch (error) {
      return next(error);
    }
  },
);

export default productRouter;
