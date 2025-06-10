import User from "../../models/userSchema.js"; // 유저 스키마
// import Post from "../../models/postSchema.js"; // 포스트 스키마 나중에 연동

// 로그인 연동 전이므로 userId는 하드코딩 (임시용)
export const updateProfile = async (req, res) => {
  try {
    const userId = "appleee"; // TODO: 나중에 req.user.userId 로 바꾸기
    const updatedData = req.body;

    // 예시로만 구조 잡기 (실제 DB 업데이트는 나중에 구현)
    console.log(`📌 수정 요청:`, updatedData);

    res.json({ message: "프로필 수정 요청이 정상적으로 수신되었습니다." });
  } catch (error) {
    console.error("프로필 수정 실패:", error);
    res.status(500).json({ message: "서버 오류" });
  }
};

// export const getMyPosts = async (req, res) => {
//   try {
//     const userId = "appleee"; // 나중엔 req.user.userid로 변경
//     const posts = await Post.find({ userid: userId }).sort({ createdAt: -1 });
//     res.json(posts);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "내 게시글 조회 실패", error: err.message });
//   }
// };

export const getMyPosts = async (req, res) => {
  try {
    // 🔹 실제 DB 연결 대신 하드코딩된 데이터 응답
    const posts = [
      {
        _id: "1",
        title: "영업허가 신청 시 주의사항",
        content: "신청 전에 이 서류 꼭 챙기세요!",
        createdAt: "2024-12-01T09:00:00Z",
        views: 132,
        likes: 21,
        comments: 4,
      },
      {
        _id: "2",
        title: "허가증 발급 소요 기간은?",
        content: "보통 7일 소요됩니다.",
        createdAt: "2024-11-28T15:30:00Z",
        views: 92,
        likes: 15,
        comments: 3,
      },
    ];

    res.json(posts);
  } catch (err) {
    console.error("❌ 내 글 조회 실패:", err);
    res.status(500).json({ message: "서버 오류" });
  }
};

export const getMyComments = async (req, res) => {
  try {
    // 로그인 미구현 상태이므로 하드코딩한 userid 사용
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
        comment: "정리 감사합니다 ",
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
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "댓글 불러오기 실패", error: err.message });
  }
};
