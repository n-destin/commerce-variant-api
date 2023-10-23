import express from "express";
import exampleRouter from "./example.routes";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";
import categoryRouter from "./category.routes";
import conditionRouter from "./condition.routes";

const apiRouter = express.Router();
apiRouter.use("/example", exampleRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/conditions", conditionRouter);
export default apiRouter;
