import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import { IUser } from "../types/User.type";
import { SliderController } from "../controllers/Slider.controller";
import { IFilters } from "../types/slider.type";
import { checkSlider } from "../middlewares/slider.middleware";

const sliderRouter = express.Router();

sliderRouter.get("/user/my-sliders",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as IUser;
      const notice = await SliderController.getMySliders(user._id);
      return res.status(200).json(notice);
    } catch (error) {
      return next(error);
    }
  });


sliderRouter.get("/type/ads",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as IUser;
      const notice = await SliderController.getAllAdsSliders();
      return res.status(200).json(notice);
    } catch (error) {
      return next(error);
    }
  }
);

sliderRouter.get("/type/hero",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as IUser;
      const notice = await SliderController.getAllHeroSliders();
      return res.status(200).json(notice);
    } catch (error) {
      return next(error);
    }
  }
);


sliderRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as IUser;
      const notice = await SliderController.createSlider({ ...req.body, owner: user._id });
      return res.status(201).json(notice);
    } catch (error) {
      return next(error);
    }
  },
);

sliderRouter.put(
  "/:sliderId",
  checkSlider,
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updateSliderStatus = await SliderController.updateSliderStatus(
        req.params.sliderId,
        {
          ...req.body,
        },
      );
      return res.status(200).json(updateSliderStatus);
    } catch (error) {
      return next(error);
    }
  },
);



export default sliderRouter;