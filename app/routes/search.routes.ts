import express, { Request, Response } from "express";
import { SearchController } from "../controllers/search.controller";

const searchRouter = express.Router();

searchRouter.get(
  "/:searchQuery",
  async (req: Request, res: Response) => {
    try {
      const products = await SearchController.searchProducts(
        req.params.searchQuery,
      );
      if (products.length > 0) {
        return res.status(200).json({ message: 'Search was successful', products: products });
      } else {
        return res.status(404).json({ message: 'No products found' });
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: 'An error occurred', error: error.toString() });
      }
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  },
);

export default searchRouter;