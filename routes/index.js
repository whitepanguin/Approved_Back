import express from "express";
import { index } from "../controller/index.js";
import userRouter from "./user/userRouter.js";
import authRouter from "./auth/authRouter.js";

const rootRouter = express.Router();

rootRouter.get("/", index);
rootRouter.use("/users", userRouter);
rootRouter.use("/auth", authRouter);

export default rootRouter;
