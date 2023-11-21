import express, { Request, Response } from "express";
import { AllUsersController } from "../controllers/allUsers.controller";
import passport from "passport";

const allUsersRouter = express.Router();

allUsersRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (_: Request, res: Response) => {
    try {
      const controller = new AllUsersController();
      const users = await controller.getAllUsers();
      if (users.length > 0) {
        return res.status(200).json({
          message: "Users found",
          number: users.length,
          users: users,
        });
      } else {
        return res.status(404).json({ message: "No users found" });
      }
    } catch (error) {
      if (error instanceof Error) {
        return res
          .status(500)
          .json({ message: "An error occurred", error: error.toString() });
      }
      return res.status(500).json({ message: "An unknown error occurred" });
    }
  },
);

allUsersRouter.put(
  "/ban/:userId",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response) => {
    try {
      const controller = new AllUsersController();
      const user = await controller.banUser(req.params.userId);
      if (user) {
        return res.status(200).json({ message: "User banned successfully", user });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      if (error instanceof Error) {
        return res
          .status(500)
          .json({ message: "An error occurred", error: error.toString() });
      }
      return res.status(500).json({ message: "An unknown error occurred" });
    }
  },
);

allUsersRouter.put(
  "/unban/:userId",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response) => {
    try {
      const controller = new AllUsersController();
      const user = await controller.unbanUser(req.params.userId);
      if (user) {
        return res.status(200).json({ message: "User unbanned successfully", user });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      if (error instanceof Error) {
        return res
          .status(500)
          .json({ message: "An error occurred", error: error.toString() });
      }
      return res.status(500).json({ message: "An unknown error occurred" });
    }
  },
);

export default allUsersRouter;
