import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import { NoticeController } from "../controllers/notice.controller";
import { IUser } from "../types/User.type";

const noticeRouter = express.Router();

noticeRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notice = await NoticeController.getNotices();
    return res.status(200).json(notice);
  } catch (error) {
    return next(error);
  }
});

noticeRouter.get("/user/my-notices",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as IUser;
      const notice = await NoticeController.getMyNotices(user._id);
      return res.status(200).json(notice);
    } catch (error) {
      return next(error);
    }
  });

noticeRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as IUser;
      const notice = await NoticeController.createNotice({ ...req.body, owner: user._id });
      return res.status(201).json(notice);
    } catch (error) {
      return next(error);
    }
  },
);
export default noticeRouter;