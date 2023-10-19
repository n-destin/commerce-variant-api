import express, { NextFunction, Request, Response } from "express";
import { ExampleController } from "../controllers/Example.controller";
const exampleRouter = express.Router();
exampleRouter.get("/", async (req: Request, res: Response) => {
	const response = await ExampleController.getExample();
	return res.status(200).json({ message: response });
});

exampleRouter.get("/error", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const response = await ExampleController.errorExample();
		return res.status(200).json({ message: response });
	} catch (error) {
		return next(error);
	}
});
export default exampleRouter;