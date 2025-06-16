import mongoose from "mongoose";
// import { getCurrentTime } from "../utils/time.js";

const { Schema, model } = mongoose;

const commentSchema = new Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // ← 나중에 populate 쓸 수 있게
      required: true,
    }, // 연결된 게시글 ID
    userid: { type: String, required: true }, // 작성자 ID
    content: { type: String, required: true }, // 댓글 본문

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default model("Comment", commentSchema, "comments");
