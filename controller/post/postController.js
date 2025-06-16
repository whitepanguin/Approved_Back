import Post from "../../models/postSchema.js";

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
