import express from "express";
import passport from "passport";
import {
  getAllPosts,
  createPost,
  getPostById,
  getPostCountByUser,
  toggleLike,
  incrementView,
  getPostsByUser,
  getPostsLikedByUser,
} from "../../controller/post/postController.js";

const router = express.Router();

router.get("/", getAllPosts); // 게시글 목록
router.post("/", createPost); // 게시글 작성
router.get("/user/:userid", getPostsByUser); // 내 게시글 불러오기
router.get("/:id", getPostById);
router.get("/count/:userid", getPostCountByUser); // 작성글 수 가져오기
// router.patch("/:postId/like", toggleLike);
router.patch("/:postId/view", incrementView); // 조회수 증가
// PATCH /posts/:postId/like
router.patch(
  "/:postId/like",
  passport.authenticate("jwt", { session: false }),
  toggleLike
);
router.get("/liked/:userid", getPostsLikedByUser);

export default router;
