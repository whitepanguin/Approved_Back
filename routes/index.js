import express from "express";
import { index } from "../controller/index.js";
import userRouter from "./user/userRouter.js";
import authRouter from "./auth/authRouter.js";
import mypageRouter from "./mypage/mypage.js";

const rootRouter = express.Router();

rootRouter.get("/", index);
rootRouter.use("/users", userRouter);
rootRouter.use("/auth", authRouter);
rootRouter.use("/mypage", mypageRouter);

export default rootRouter;
