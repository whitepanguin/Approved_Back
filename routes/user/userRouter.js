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
} from "../../controller/user/userController.js";
import multer from "multer";
import fs from "fs";
import User from "../../models/userSchema.js";

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
userRouter.put("/profile", modify);
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
userRouter.post(
  "/certifyRequest",
  upload.array("imageUrls", 5),
  certifyRequest
); // 💡 강사 인증 요청
userRouter.get("/allUsers", getAllUsers);

// ✅ [추가] 닉네임 중복 확인 라우터
userRouter.get("/check-duplicate", async (req, res) => {
  try {
    const { userid } = req.query;
    if (!userid) {
      return res.status(400).json({ message: "닉네임이 필요합니다." });
    }

    const exists = await User.findOne({ userid }).lean();
    res.status(200).json({ exists: !!exists });
  } catch (err) {
    console.error("❌ 닉네임 중복확인 실패:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});
export default userRouter;
