import express from "express";
import passport from "passport";
import {
  localStrategy,
  jwtStrategy,
} from "../../controller/auth/authController.js";

const authRouter = express.Router();
const clientURL = "http://localhost:3000";

// 로컬 로그인
/*
authRouter.post(
  "/local",
  passport.authenticate("local", { session: false }),
  localStrategy
);
*/
authRouter.post(
  "/local",
  passport.authenticate("local", { session: false, failWithError: true }),
  localStrategy,
  (err, req, res, next) => {
    res.status(401).json({
      loginSuccess: false,
      message: "이메일 또는 비밀번호가 잘못되었습니다.",
    });
  }
);

// jwt 토큰
authRouter.post(
  "/jwt",
  passport.authenticate("jwt", { session: false }),
  jwtStrategy
);

// 구글 로그인
authRouter.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: clientURL,
  }),
  (req, res) => {
    const { jwtToken } = req.user;
    return res.redirect(`${clientURL}?jwtToken=${jwtToken}`);
  }
);

// 카카오 로그인
authRouter.get("/kakao", passport.authenticate("kakao", { session: false }));
authRouter.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    session: false,
    failureRedirect: clientURL,
  }),
  (req, res) => {
    const { jwtToken } = req.user;
    return res.redirect(`${clientURL}?jwtToken=${jwtToken}`);
  }
);

// 네이버 로그인
authRouter.get("/naver", passport.authenticate("naver", { session: false }));
authRouter.get(
  "/naver/callback",
  passport.authenticate("naver", {
    session: false,
    failureRedirect: clientURL,
  }),
  (req, res) => {
    const { jwtToken } = req.user;
    return res.redirect(`${clientURL}?jwtToken=${jwtToken}`);
  }
);

export default authRouter;
