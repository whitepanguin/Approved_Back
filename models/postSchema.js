// models/Post.js
import { Schema, model } from "mongoose";
// import { getCurrentTime } from "../utils/utils.js";

const postSchema = new Schema(
  {
    userid: { type: String, required: true },

    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true }, // 카테고리 (info, qna, daily, startup)
    tags: [{ type: String }], // 태그 배열

    views: { type: Number, default: 0 },
    todayViews: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    preview: { type: String },

    isHot: { type: Boolean, default: false }, // 인기글 여부
    isNotice: { type: Boolean, default: false }, // 공지글 여부

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default model("Post", postSchema, "posts");
