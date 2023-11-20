import mongoose from "mongoose";
import { appConfig } from "./app";

const connectDB = async () => {
  await mongoose.connect(appConfig.databaseUrl);
  console.log("Db Connected");
};
export default connectDB;
