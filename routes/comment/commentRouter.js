// routes/comment/commentRouter.js
import express from "express";
import {
  getCommentsByPost,
  createComment,
} from "../../controller/comment/commentController.js";

const router = express.Router();

router.get("/:postId", getCommentsByPost); // GET /comments/:postId
router.post("/", createComment); // POST /comments

export default router;
