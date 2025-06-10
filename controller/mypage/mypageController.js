// controllers/mypage/mypageController.js
import User from "../../models/userSchema.js";
// import Post from "../../models/postSchema.js"; // 실제 게시글 모델
// import Comment from "../../models/commentSchema.js"; // 실제 댓글 모델

// 로그인 연동 전이므로 userId는 하드코딩 (임시)
export const getProfile = async (req, res) => {
  try {
    // const userId = req.user.userId; // 로그인 연동 시
    const dummyProfile = {
      userId: "apple",
      name: "김사과",
      email: "apple@example.com",
      phone: "010-1234-5678",
      businessType: "IT업",
      joinDate: "2024.01.01",
    };
    res.status(200).json(dummyProfile);
  } catch (error) {
    console.error("프로필 불러오기 실패:", error);
    res.status(500).json({ message: "서버 오류" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updatedData = req.body;
    const userId = "apple"; // const userId = req.user.userId; (로그인 연동 시 사용)

    console.log("수정 요청 데이터:", updatedData);

    // 실제 DB 반영 코드 (로그인/DB 연동 시)
    // await User.findOneAndUpdate({ userId }, updatedData);

    res.json({ message: "프로필 수정 요청이 정상적으로 수신되었습니다." });
  } catch (error) {
    console.error("프로필 수정 실패:", error);
    res.status(500).json({ message: "서버 오류" });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    // const userId = req.user.userId;
    const posts = [
      {
        _id: "1",
        title: "영업허가 신청 시 주의사항",
        content: "신청 전에 이 서류 꼭 챙기세요!",
        preview: "신청 전에 이 서류 꼭 챙기세요!",
        date: "2024-12-01",
        views: 132,
        likes: 21,
        comments: 4,
      },
      {
        _id: "2",
        title: "허가증 발급 소요 기간은?",
        content: "보통 7일 소요됩니다.",
        preview: "보통 7일 소요됩니다.",
        date: "2024-11-28",
        views: 92,
        likes: 15,
        comments: 3,
      },
    ];

    // 실제 DB 연동 시
    // const posts = await Post.find({ userId }).sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("내 글 조회 실패:", err);
    res.status(500).json({ message: "서버 오류" });
  }
};

export const getMyComments = async (req, res) => {
  try {
    // const userId = req.user.userId;
    const comments = [
      {
        id: 1,
        postTitle: "2024년 달라지는 인허가 제도 총정리",
        comment: "이 부분은 정말 중요한 것 같아요!",
        date: "2024-06-10",
        likes: 5,
      },
      {
        id: 2,
        postTitle: "소상공인 정책 변화 요약",
        comment: "정리 asdasd감사합니다",
        date: "2024-06-08",
        likes: 2,
      },
      {
        id: 3,
        postTitle: "식품 위생 허가 체크리스트",
        comment: "실제 신청할 때 큰 도움이 되었어요.",
        date: "2024-06-05",
        likes: 8,
      },
    ];

    // 실제 DB 연동 시
    // const comments = await Comment.find({ userId }).sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    console.error("댓글 조회 실패:", err);
    res.status(500).json({ message: "서버 오류" });
  }
};

export const getLikedPosts = async (req, res) => {
  try {
    // const userId = req.user.userId;
    const likedPosts = [
      {
        id: 1,
        title: "2023년 달라지는 인허가 제aasdasdas도 총정리",
        author: "정책wjs문가",
        date: "2023-06-10",
        views: 2341,
        likes: 156,
        comments: 45,
      },
      {
        id: 2,
        title: "소상공인 지원 정책 모음",
        author: "경제연구소",
        date: "2023-06-05",
        views: 1876,
        likes: 134,
        comments: 28,
      },
      {
        id: 3,
        title: "식품접객업 인허가 체크리스트",
        author: "식당CEO",
        date: "2023-05-30",
        views: 1543,
        likes: 98,
        comments: 37,
      },
    ];

    // 실제 DB 연동 시
    // const likedPosts = await Post.find({ likes: userId });

    res.json(likedPosts);
  } catch (err) {
    console.error("좋아요한 글 조회 실패:", err);
    res.status(500).json({ message: "서버 오류" });
  }
};
