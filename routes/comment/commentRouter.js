// routes/comment/commentRouter.js
import express from "express";
import {
  getCommentsByPost,
  createComment,
  getCommentsByUser,
} from "../../controller/comment/commentController.js";

const router = express.Router();

router.get("/:postId", getCommentsByPost); // GET /comments/:postId
router.post("/", createComment); // POST /comments
// router.get("/user/:email", getCommentsByUser);
router.get("/user/:userid", getCommentsByUser);

export default router;
