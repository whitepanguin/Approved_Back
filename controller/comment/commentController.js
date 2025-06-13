// controller/comment/commentController.js
import Comment from "../../models/commentSchema.js";
import Post from "../../models/postSchema.js";

// 특정 게시글의 모든 댓글 가져오기
export const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: 1,
    });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: "댓글 불러오기 실패" });
  }
};

// 댓글 등록
export const createComment = async (req, res) => {
  try {
    const { postId, userid, content } = req.body;
    const newComment = new Comment({ postId, userid, content });
    await newComment.save();
    console.log("🔥 댓글 저장 요청:", { postId, userid, content });
    // 🔄 Post 문서의 댓글 수 +1
    await Post.findByIdAndUpdate(postId, { $inc: { comments: 1 } });

    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: "댓글 작성 실패" });
  }
};
