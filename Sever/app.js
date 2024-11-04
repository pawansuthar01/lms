import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRouters from "./router/auth.Router.js";
import ErrorMiddleware from "./middlewares/error.middleware.js";
import databaseConnect from "./config/dbConnection.js";
import CourseRouter from "./router/Courese.Router.js";
import PaymentRouter from "./router/payment.Router.js";
import ContactRouter from "./router/ContactRouter.js";
import { userState } from "./controllers/authController.js";

const app = express();
databaseConnect();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
console.log(process.env.FRONTEND_URL);
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);
app.use("/ping", (req, res) => {
  res.status(200).send("is updated");
});

app.use("/api/v1/user", authRouters);
app.use("/api/v1/Course", CourseRouter);
app.use("/api/v1/payment", PaymentRouter);
app.use("/api/v1/Contact", ContactRouter);
app.use("/api/v1/Admin", userState);

app.all("/*", (req, res) => {
  res.status(404).send("OOPS! page not found !! ");
});
app.use(ErrorMiddleware);
// app is export
export default app;
