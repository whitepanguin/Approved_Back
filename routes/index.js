import express from "express";
import { index } from "../controller/index.js";
import userRouter from "./user/userRouter.js";
import authRouter from "./auth/authRouter.js";
import postRouter from "./post/postRouter.js";

const rootRouter = express.Router();

rootRouter.get("/", index);
rootRouter.use("/users", userRouter);
rootRouter.use("/auth", authRouter);
rootRouter.use("/posts", postRouter);

export default rootRouter;
