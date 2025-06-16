import Post from "../../models/postSchema.js";
import Like from "../../models/likeSchema.js";

// 전체 게시글 가져오기
export const getAllPosts = async (req, res) => {
  try {
    const { category, sort } = req.query;

    // 정렬 기준 설정
    let sortOption = { createdAt: -1 }; // 기본: 최신순
    if (sort === "popular") sortOption = { views: -1 };
    else if (sort === "comments") sortOption = { comments: -1 };
    else if (sort === "today") sortOption = { todayViews: -1 };

    // 카테고리 필터 설정
    const filter = category ? { category } : {};

    const posts = await Post.find(filter).sort(sortOption);
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: "게시글 불러오기 실패" });
  }
};

// 게시글 작성
export const createPost = async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save(); // 저장된 결과

    // ✅ createdAt 포함한 전체 객체 응답
    res.status(201).json(savedPost);
  } catch (err) {
    console.error("❌ 저장 실패:", err.message);
    res.status(500).json({ error: "게시글 작성 실패" });
  }
};

// 게시글 상세 조회
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "게시글 없음" });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: "서버 오류" });
  }
};

// 내가 쓴 글 목록
export const getPostsByUser = async (req, res) => {
  const { email } = req.params; // URL = /posts/user/테스트
  try {
    const posts = await Post.find({ email }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    console.error("내 글 불러오기 실패:", err);
    res.status(500).json({ error: "내 글 조회 실패" });
  }
};

// 작성글 수 로직
export const getPostCountByUser = async (req, res) => {
  const { userid } = req.params;
  try {
    const count = await Post.countDocuments({ userid });
    res.status(200).json({ count });
  } catch (err) {
    console.error("작성글 수 조회 실패:", err);
    res.status(500).json({ error: "서버 오류" });
  }
};


// 게시글 삭제
export const deletePost = async (req, res) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }
    res.status(200).json({ message: "삭제 성공" });
  } catch (err) {
    console.error("❌ 게시글 삭제 오류:", err);
    res.status(500).json({ error: "서버 오류" });
  }
};

// 게시글 수정
export const updatePost = async (req, res) => {
  try {
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // 수정된 내용 반환
    });
    if (!updated) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }
    res.status(200).json(updated);
  } catch (err) {
    console.error("❌ 게시글 수정 오류:", err);
    res.status(500).json({ error: "서버 오류" });
  }
};

// 카테고리별 게시글 수
export const getCategoryCounts = async (req, res) => {
  try {
    const counts = await Post.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    // 결과를 객체로 변환 (ex: { info: 12, qna: 5, ... })
    const result = {};
    counts.forEach((item) => {
      result[item._id] = item.count;
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("❌ 카테고리별 게시글 수 집계 실패:", err);
    res.status(500).json({ error: "서버 오류" });
  }
};

// 카테고리 댓글&게시글 연결
export const getCategoryCommentsCounts = async (req, res) => {
  try {
    const posts = await Post.find();

    const counts = posts.reduce((acc, post) => {
      const category = post.category;
      const commentCount = post.comments || 0;
      acc[category] = (acc[category] || 0) + commentCount;
      return acc;
    }, {});

    res.json(counts);
  } catch (err) {
    console.error("❌ 카테고리 댓글 수 계산 오류:", err);
    res.status(500).json({ error: "서버 오류" });

  }
};
