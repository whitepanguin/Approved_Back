import mongoose from "mongoose";
const { Schema, model } = mongoose;

const likeSchema = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    userid: { type: String, required: true },
  },
  { timestamps: true }
);

// “같은 게시글 + 같은 사용자” 조합은 한 번만 허용
likeSchema.index({ postId: 1, userid: 1 }, { unique: true });

export default model("Like", likeSchema, "likes");
