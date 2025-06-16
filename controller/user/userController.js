import path from "path";
import User from "../../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const salt = await bcrypt.genSalt(10);

// 회원가입
const register = async (req, res) => {
  console.log(req.body);
  // 1) 기존 회원이 있는지 검사한다.
  const foundUser = await User.findOne({ email: req.body.email }).lean();
  if (foundUser) {
    // 있으면
    return res.status(409).json({
      registerSuccess: false,
      message: "이미 존재하는 이메일입니다.",
    });
  } else {
    // 2) 비밀번호를 암호화 한다.
    // 높을수록 시간이 오래걸리고, 보안이 높다.
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // 3) 회원의 정보를 DB에 INSERT한다.
    await User.create({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
      birthDate: req.body.birthDate,
      userid: req.body.userid,
    });

    return res.status(201).json({
      registerSuccess: true,
      message: "축하합니다. 회원가입이 완료되었습니다.",
    });
  }
};

// 로그인
const login = async (req, res) => {
  const { email, password } = req.body;

  const foundUser = await User.findOne({ email: email }).lean();
  const validPassword = await bcrypt.compare(password, foundUser.password);

  // 방어 코드, early return
  if (!foundUser) {
    // 회원이 없으면
    return res.status(409).json("회원이 아닙니다.");
  } else {
    // 회원인 상태
    if (!validPassword) {
      return res.status(409).json({
        loginSuccess: false,
        message: "이메일과 비밀번호를 확인해 주세요.",
      });
    }
    // 아이디와 비밀번호가 일치하는 유저
    // 1) 회원 정보를 보낸다.
    const { password, ...currentUser } = foundUser;

    res.status(200).json({
      loginSuccess: true,
      message: "로그인 성공하였습니다.",
      currentUser: currentUser,
    });
    // 2) JWT(Json Web Token)토큰은 소셜에서 추후 같이 사용.
  }
};

//유저 찾기
const findUser = async (req, res) => {
  const { name, birthDate } = req.body;

  try {
    const user = await User.findOne({ name, birthDate }).lean();
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    res.status(200).json({ message: `이메일를 찾았습니다: ${user.email}` });
  } catch (error) {
    console.error("Error during findUser:", error);
    res.status(500).json({ message: "서버 오류" });
  }
};

//비밀번호 찾기
const findPassword = async (req, res) => {
  const { email, name, birthDate } = req.body;

  try {
    const user = await User.findOne({ email, name, birthDate }).lean();
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
    // 6자리 임시 비밀번호 생성
    const temporaryPassword = Math.random().toString(36).slice(-6); // 영문+숫자 6자리

    const hashedPassword = await bcrypt.hash(temporaryPassword, salt);
    await User.updateOne(
      { email: user.email },
      { $set: { password: hashedPassword } }
    );

    res.status(200).json({ message: `임시 비밀번호: ${temporaryPassword}` });
  } catch (error) {
    console.error("Error during findUser:", error);
    res.status(500).json({ message: "서버 오류" });
  }
};

// 20분
// 회원정보 수정
const modify = async (req, res) => {
  try {
    const { email, name, userid, address, birthDate, phone, businessType } =
      req.body;

    // 📌 이메일 필수 체크
    if (!email) {
      return res.status(400).json({
        updateSuccess: false,
        message: "이메일이 필요합니다.",
      });
    }

    // 📌 사용자 존재 확인
    const foundUser = await User.findOne({ email }).lean();
    if (!foundUser) {
      return res.status(404).json({
        updateSuccess: false,
        message: "존재하지 않는 사용자입니다.",
      });
    }

    // 📌 업데이트 데이터 구성
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (userid) updateData.userid = userid;
    if (address) updateData.address = address;
    if (businessType) updateData.businessType = businessType;
    if (birthDate) updateData.birthDate = Number(birthDate); // ✅ 숫자 변환
    updateData.updatedAt = new Date().toISOString(); // ✅ 업데이트 시간 갱신

    // 📌 정보 업데이트
    await User.updateOne({ email }, { $set: updateData });

    // 📌 업데이트된 정보 반환
    const updatedUser = await User.findOne({ email }).lean();
    res.status(200).json({
      updateSuccess: true,
      message: "성공적으로 업데이트가 완료되었습니다.",
      currentUser: updatedUser,
    });
  } catch (error) {
    console.error("회원정보 업데이트 오류:", error);
    res.status(500).json({
      updateSuccess: false,
      message: "서버 오류로 업데이트에 실패했습니다.",
    });
  }
};

// ✅ 유저 정보 조회 API 추가
const getUserInfo = async (req, res) => {
  const { email } = req.query; // 🔑 쿼리 파라미터에서 이메일 받기

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "이메일이 필요합니다.",
      });
    }

    const user = await User.findOne({ email }).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "사용자를 찾을 수 없습니다.",
      });
    }

    res.status(200).json(user); // ✅ 사용자 정보 반환
  } catch (error) {
    console.error("유저 정보 조회 실패:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
};

// 회원 탈퇴
const remove = async (req, res) => {
  const { email } = req.body;
  const foundUser = await User.findOne({ email: email }).lean();
  await User.deleteOne(foundUser);

  res.status(200).json({
    updateSuccess: true,
    message: "회원탈퇴 완료. 다음생에 만나요",
  });
};

const updatePicture = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("여기여기여기여기여기여기", req.body);

    if (!req.file) {
      return res.status(400).json({ message: "파일이 업로드되지 않았습니다." });
    }

    const uploadFolder = "uploads/profiles";
    const relativePath = path
      .join(uploadFolder, req.file.filename)
      .replaceAll("\\", "/");

    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { profile: relativePath },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    res.status(200).json({
      message: "프로필 이미지가 성공적으로 업로드되었습니다.",
      filePath: relativePath,
    });
  } catch (err) {
    console.error("프로필 업데이트 오류:", err);
    res.status(500).json({ message: "프로필 업로드 중 오류가 발생했습니다." });
  }
};

// 비밀번호 변경
const updatePassword = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    // 사용자 조회
    const foundUser = await User.findOne({ email }).lean();
    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: "사용자를 찾을 수 없습니다.",
      });
    }

    // 현재 비밀번호 확인
    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      foundUser.password
    );
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "현재 비밀번호가 올바르지 않습니다.",
      });
    }

    // 새 비밀번호 해싱
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // 비밀번호 업데이트
    await User.updateOne({ email }, { $set: { password: hashedNewPassword } });

    return res.status(200).json({
      success: true,
      message: "비밀번호가 성공적으로 변경되었습니다.",
    });
  } catch (error) {
    console.error("비밀번호 변경 오류:", error);
    return res.status(500).json({
      success: false,
      message: "서버 오류로 인해 비밀번호 변경에 실패했습니다.",
    });
  }
};

const certifyRequest = async (req, res) => {
  try {
    const { email, qualifyNumber } = req.body;

    if (!req.files || req.files.length === 0 || !email || !qualifyNumber) {
      return res
        .status(400)
        .json({ message: "모든 필수 정보를 입력해주세요." });
    }

    const imageUrls = req.files.map((file) =>
      path.join("uploads/certify", file.filename).replaceAll("\\", "/")
    );

    const newCertify = new Certify({
      email,
      qualifyNumber,
      imageUrls,
      isCertified: false,
    });

    await newCertify.save();

    res.status(201).json({
      success: true,
      message: "강사 인증 요청이 성공적으로 제출되었습니다.",
      certify: newCertify,
    });
  } catch (error) {
    console.error("강사 인증 요청 오류:", error);
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "email name"); // 이메일과 이름만 가져옴
    res.json(users);
  } catch (error) {
    console.error("유저 목록을 불러오는 중 오류 발생:", error);
    res.status(500).json({ error: "서버 오류" });
  }
};

export {
  register,
  login,
  modify,
  remove,
  updatePicture,
  getUserInfo,
  findUser,
  findPassword,
  updatePassword,
  certifyRequest,
};
