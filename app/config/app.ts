import dotenv from "dotenv";
dotenv.config();


export const appConfig = {
	environment: process.env.NODE_ENV as string,
	PORT:process.env.PORT || 4321
};
