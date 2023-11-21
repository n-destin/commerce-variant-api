import express from "express";
import exampleRouter from "./example.routes";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";
import categoryRouter from "./category.routes";
import conditionRouter from "./condition.routes";
import assetsRouter from "./assets.routes";
import productRouter from "./product.routes ";
import purposeRouter from "./purpose.routes";
import collegeRouter from "./college.routes";
import noticeRouter from "./notice.routes";
import orderRouter from "./order.routes";
import searchRouter from "./search.routes";
import chatRouter from "./chat.routes";
import messageRouter from "./message.routes";
import rentProductsRouter from "./rentProducts.routes";
import donateProductsRouter from "./donateProducts.routes";
import statisticsRouter from "./statistics.routes";
import sliderRouter from "./slider.routes";
import allUsersRouter from "./allUsers.routes";

const apiRouter = express.Router();
apiRouter.use("/example", exampleRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/conditions", conditionRouter);
apiRouter.use("/assets", assetsRouter);
apiRouter.use("/products", productRouter);
apiRouter.use("/purpose", purposeRouter);
apiRouter.use("/colleges", collegeRouter);
apiRouter.use("/notices", noticeRouter);
apiRouter.use("/orders", orderRouter);
apiRouter.use("/search", searchRouter);
apiRouter.use("/chats", chatRouter);
apiRouter.use("/messages", messageRouter);
apiRouter.use("/rent-products", rentProductsRouter);
apiRouter.use("/donate-products", donateProductsRouter);
apiRouter.use("/statistics", statisticsRouter);
apiRouter.use("/sliders", sliderRouter);
apiRouter.use("/all-users", allUsersRouter);
export default apiRouter;
