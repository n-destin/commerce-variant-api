import passport from "passport";
import express from "express";
import exampleRouter from "./example.routes";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";

const apiRouter = express.Router();
apiRouter.use("/example", exampleRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use(passport.authenticate("jwt", { session: false }));
apiRouter.use("/users", userRouter);
export default apiRouter;
