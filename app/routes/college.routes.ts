import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import { CollegeController } from "../controllers/college.controller";

const collegeRouter = express.Router();
collegeRouter.use(passport.authenticate("jwt", { session: false }));
collegeRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const colleges = await CollegeController.getColleges();
    return res.status(200).json(colleges);
  } catch (error) {
    return next(error);
  }
});
export default collegeRouter;
