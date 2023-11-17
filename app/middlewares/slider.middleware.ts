import { NextFunction } from "express";
import { Request, Response } from "express";
import { Slider } from "../database/Slider";

export const checkSlider = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.sliderId as string;
  try {
    const slider = await Slider.findById({ _id: id });
    if (!slider) {
      return res.status(400).json({
        message: "No Slider found",
      });
    }

    if (slider.sliderStatus === 'ACTIVE') {
      req.body.sliderStatus = "DISABLE";
    } else {
      req.body.sliderStatus = 'ACTIVE';
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while checking the slider",
    });
  }
};
