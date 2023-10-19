import express, { Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import apiRouter from "./routes/api.routes";
import { appConfig } from "./config/app";
import CustomError from "./utils/CustomError";
import cors from "cors";


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(
	"/api/docs",
	swaggerUi.serve,
	swaggerUi.setup(undefined, {
		swaggerOptions: {
			url: "/swagger.json",
		},
	}),
);
app.use("/api",apiRouter);
app.use((err: CustomError, req: Request, res: Response,_next:NextFunction) =>
	res.status(err.statuscode || 500).json({ error: err.message || "Internal server error" }),
);

app.listen(appConfig.PORT, () => {
	console.log(`The app is running on port ${appConfig.PORT}`);
});