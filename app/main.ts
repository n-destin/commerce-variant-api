import express, { Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import apiRouter from "./routes/api.routes";
import { appConfig } from "./config/app";
import CustomError from "./utils/CustomError";
import cors from "cors";
import connectDB from "./config/db";
import passport from "passport";
import session from "express-session";
import { initAuthStategies } from "./utils/authStrategies";

const app = express();
app.use(
 session({
  secret: "_",
  resave: false,
  saveUninitialized: false,
 }),
);

app.use(passport.initialize());
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
app.use("/api", apiRouter);
initAuthStategies();
passport.serializeUser((user, done) => {
 done(null, user);
});

connectDB().then(() => {
 app.listen(appConfig.PORT, () => {
  console.log(`The app is running on port ${appConfig.PORT}`);
 });
});
app.use(
 (err: Error | CustomError, req: Request, res: Response, _next: NextFunction) => {
  console.log(err);
  res.json({ error: err.message || "Internal server error" });
 },
);
