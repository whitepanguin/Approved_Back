import express from "express";
import {
  updateProfile,
  getMyPosts,
  getMyComments,
} from "../../controller/mypage/mypageController.js";

const router = express.Router();

router.get("/profile", (req, res) => {
  res.status(200).json({
    userId: "apple",
    name: "김사과",
    email: "apple@example.com",
    phone: "010-1234-5678",
    businessType: "IT업",
    joinDate: "2024.01.01",
  });
});

// 프로필 수정용 라우트 (토큰 인증은 추후 추가 예정)
router.put("/profile", updateProfile);

router.get("/posts", getMyPosts);

router.get("/comments", getMyComments);
export default router;
