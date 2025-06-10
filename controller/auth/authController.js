import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import passport from "passport";

dotenv.config(); // 환경 변수
const SECRET_KEY = process.env.SECRET_KEY;

const localStrategy = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "인증된 사용자가 없습니다.",
        loginSuccess: false,
      });
    }

    return res.status(200).json({
      message: "토큰 인증 성공",
      loginSuccess: true,
      user,
    });
  } catch (error) {
    console.error("JWT 인증 오류", error);
    return res
      .status(500)
      .json({ message: "서버 오류가 발생했습니다.", error });
  }
};

const jwtStrategy = async (req, res, next) => {
  try {
    // 인가된 유저의 정보가 req.user에 담겨서 온다.
    const jwtAuthenticateUser = req.user;
    const { password, ...foundUser } = jwtAuthenticateUser;

    return res.json({
      message: "자동 로그인 성공",
      user: foundUser,
    });
  } catch (error) {
    console.error("jwtStrategy error", error);
    next(error);
  }
};

export { localStrategy, jwtStrategy };
