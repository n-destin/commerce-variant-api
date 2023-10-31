import { NextFunction } from "express";
import { Request, Response } from "express";
import { Category } from "../database/Category";

export const checkCategory = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id as string;

  try {
    const category = await Category.findById(id);

    if (!category) {
      return res.status(409).json({
        message: "No category is available with the given ID"
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while checking the category"
    });
  }
};

