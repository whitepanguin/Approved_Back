import express from "express";
import {
  getAllPosts,
  createPost,
  getPostById,
  getPostCountByUser,
  deletePost,
  updatePost,
} from "../../controller/post/postController.js";
import { getCategoryCounts } from "../../controller/post/postController.js";

const router = express.Router();

router.get("/", getAllPosts); // 게시글 목록
router.post("/", createPost); // 게시글 작성
router.get("/:id", getPostById);
router.get("/count/:userid", getPostCountByUser); // 작성글 수 가져오기
router.delete("/:id", deletePost); // 게시글 삭제
router.put("/:id", updatePost); // 게시글 수정
router.get("/category-counts", getCategoryCounts); // 카테고리별 게시글 수

export default router;
