import express from "express";
import exampleRouter from "./example.routes";

const apiRouter = express.Router();
apiRouter.use("/example",exampleRouter);

export default apiRouter;
