import { fileURLToPath } from "url";
import path from "path";
import express from "express";
import {
  register,
  login,
  modify,
  remove,
  updatePicture,
  getUserInfo,
  findUser,
  findPassword,
  updatePassword,
  certifyRequest,
  getAllUsers,
  usercount,
} from "../../controller/user/userController.js";
import multer from "multer";
import fs from "fs";

// 💡 __dirname 대체 정의
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userRouter = express.Router();

// Multer 설정
const getDynamicStorage = () => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      let folderPath;
      if (req.originalUrl.includes("/certifyRequest")) {
        // 💡 강사 인증 폴더
        folderPath = path.join(__dirname, "../../uploads/certify");
      } else {
        // 기본 프로필 사진 폴더
        folderPath = path.join(__dirname, "../../uploads/profiles");
      }

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
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

// 💡 기존 기능 및 강사 인증 요청 라우트 설정
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.put("/modify", modify);
userRouter.delete("/remove", remove);
userRouter.post("/picture", upload.single("picture"), updatePicture); // 💡 프로필 사진 변경
userRouter.get("/getUserInfo", getUserInfo);
userRouter.post("/findUser", findUser);
userRouter.post("/findPass", findPassword);
userRouter.put("/updatePassword", updatePassword);
userRouter.post(
  "/certifyRequest",
  upload.array("imageUrls", 5),
  certifyRequest
); // 💡 강사 인증 요청
userRouter.get("/allUsers", getAllUsers);
userRouter.get("/UserCount", usercount);
export default userRouter;
