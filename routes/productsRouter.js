const express = require("express");
const router = express.Router();
const UserItem = require("../schemas/productsSchema");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Create (상품 등록)
router.post("/products", async (req, res) => {
  const { title, content, author, password, status } = req.body;

  if (!title || !content || !author || !password || !status) {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
  }

  // 패스워드 암호화
  bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err) {
      return res.status(500).json({ message: "패스워드 암호화 실패" });
    }

    const newUserItem = new UserItem({
      title,
      content,
      author,
      password: hash, // 암호화된 패스워드 저장
      status,
    });

    try {
      await newUserItem.save();
      return res.status(201).json({ message: "판매 상품을 등록하였습니다." });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "상품 등록에 실패하였습니다." });
    }
  });
});

// Read (상품 목록 조회)
router.get("/products", async (req, res) => {
  try {
    const products = await UserItem.find({});
    return res.status(200).json({ data: products });
  } catch (err) {
    return res.status(500).json({ message: "상품 목록 조회에 실패하였습니다." });
  }
});

// Read (상품 상세 조회)
router.get("/products/:userItemId", async (req, res) => {
  const userItemId = req.params.userItemId;

  try {
    const product = await UserItem.findOne({ userItemId });
    if (!product) {
      return res.status(404).json({ message: "상품이 존재하지 않습니다." });
    }
    return res.status(200).json({ data: product });
  } catch (err) {
    console.log("조회 실패", err);
    return res.status(500).json({ message: "상품 조회에 실패하였습니다." });
  }
});

// Update (상품 정보 수정)
router.put("/products/:userItemId", async (req, res) => {
  const userItemId = req.params.userItemId;
  const { title, content, password, status } = req.body;

  if (!title || !content || !password) {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
  }

  try {
    const product = await UserItem.findOne({ userItemId });
    if (!product) {
      return res.status(404).json({ message: "상품이 존재하지 않습니다." });
    }

    // 사용자가 입력한 패스워드와 DB에 저장된 암호화된 패스워드 비교
    bcrypt.compare(password, product.password, async (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: "비밀번호 비교 실패" });
      }

      if (!isMatch) {
        return res.status(401).json({ message: "상품을 수정할 권한이 없습니다." });
      }

      product.title = title;
      product.content = content;
      product.status = status || product.status;

      await product.save();
      return res.status(200).json({ message: "상품 정보를 수정하였습니다." });
    });
  } catch (err) {
    return res.status(500).json({ message: "상품 수정에 실패하였습니다." });
  }
});

// Delete (상품 삭제)
router.delete("/products/:userItemId", async (req, res) => {
  const userItemId = req.params.userItemId;
  const { password } = req.body;

  try {
    const product = await UserItem.findOne({ userItemId });
    if (!product) {
      return res.status(404).json({ message: "상품이 존재하지 않습니다." });
    }

    // 사용자가 입력한 패스워드와 DB에 저장된 암호화된 패스워드 비교
    bcrypt.compare(password, product.password, async (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: "비밀번호 비교 실패" });
      }

      if (!isMatch) {
        return res.status(401).json({ message: "상품을 삭제할 권한이 없습니다." });
      }

      await UserItem.deleteOne({ userItemId });
      return res.status(200).json({ message: "상품을 삭제하였습니다." });
    });
  } catch (err) {
    return res.status(500).json({ message: "상품 삭제에 실패하였습니다." });
  }
});

module.exports = router;
// await UserItem.findByIdAndDelete(userItemId);
