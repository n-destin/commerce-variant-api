import express, { NextFunction, Request, Response } from "express";
import { CollegeController } from "../controllers/college.controller";

const collegeRouter = express.Router();
collegeRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const colleges = await CollegeController.getColleges();
    return res.status(200).json(colleges);
  } catch (error) {
    return next(error);
  }
});
export default collegeRouter;
