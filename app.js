import express from "express";
import bodyParser from "body-parser";
import connect from "./connect/connect.js";
import cors from "cors";

import dotenv from "dotenv";
import rootRouter from "./routes/index.js";
import passport from "passport";
import { initializePassport } from "./auth/auth.js";

//이미지 등록
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connect(); // Mongoose 연결
dotenv.config(); // dotenv 연결

const app = express();
const port = 8000;
// CORS 설정 (여기 추가)
app.use(
  cors({
    origin: "*", // 모든 도메인 허용 (개발 환경)
    methods: ["GET", "POST", "DELETE", "PUT"], // 허용할 HTTP 메서드
    credentials: true, // 인증 정보 포함 여부
  })
);

// 정적 파일 제공 및 비디오 디렉토리 설정
const videoDirectory = path.join(__dirname, "videos");
app.use("/videos", express.static(videoDirectory));

const storeDirectory = path.join(__dirname, "stores");
app.use("/stores", express.static(storeDirectory));

// 미들웨어 설정
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

// Passport 초기화
app.use(passport.initialize());
initializePassport();

// 💡 Multer 설정 변경
const getDynamicStorage = () => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      let folderPath;
      if (req.originalUrl.includes("/certifyRequest")) {
        // 💡 강사 인증 요청 경로 처리
        folderPath = path.join(__dirname, "./uploads/certify");
      } else {
        folderPath = path.join(__dirname, "./uploads/profiles"); // 기본은 프로필 사진 폴더
      }

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true }); // 폴더가 없으면 생성
      }

      cb(null, folderPath);
    },
    filename: (req, file, cb) => {
      const uniqueFileName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueFileName);
    },
  });
};

const upload = multer({ storage: getDynamicStorage() });

// 정적 파일 및 라우터 설정
app.use(express.json()); // JSON 요청 허용
app.use(express.urlencoded({ extended: true })); // URL 인코딩된 데이터 허용
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use(uploadMiddleware);

// 💡 정적 파일 제공 경로
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 💡 라우터 설정 및 Multer 연동

app.use("/", rootRouter);

// 서버 실행
app.listen(port, () => {
  console.log(`서버가 실행 중입니다: http://localhost:${port}`);
});
