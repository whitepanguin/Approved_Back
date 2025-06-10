// routes/mypage/mypage.js
import express from "express";
import {
  getProfile,
  updateProfile,
  getMyPosts,
  getMyComments,
  getLikedPosts,
} from "../../controller/mypage/mypageController.js";

// import auth from "../../middleware/auth.js"; // 로그인 연동 시 활성화

const router = express.Router();

// 프로필 조회
router.get("/profile", /* auth, */ getProfile);

// 프로필 수정
router.put("/profile", /* auth, */ updateProfile);

// 내가 쓴 글
router.get("/posts", /* auth, */ getMyPosts);

// 내가 쓴 댓글
router.get("/comments", /* auth, */ getMyComments);

// 좋아요 한 글글
router.get("/likes", /* auth, */ getLikedPosts);
export default router;
