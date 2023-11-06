const express = require("express");
const router = express.Router();
const UserItem = require("../schemas/productsSchema");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Create (상품 등록)
router.post("/product", async (req, res) => {
  const { title, content, author, password, status } = req.body;

  if (!title || !content || !author || !password || !status) {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
  }

  bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err) {
      return res.status(500).json({ message: "패스워드 암호화 실패" });
    }

    const newUserItem = new UserItem({
      title,
      content,
      author,
      password: hash,
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
    const products = await UserItem.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ data: products });
  } catch (err) {
    return res.status(500).json({ message: "상품 목록 조회에 실패하였습니다." });
  }
});

// Read (상품 상세 조회)
router.get("/product/:userItemId", async (req, res) => {
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
router.put("/product/:userItemId", async (req, res) => {
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
router.delete("/product/:userItemId", async (req, res) => {
  const userItemId = req.params.userItemId;
  const { password } = req.body;

  try {
    const product = await UserItem.findOne({ userItemId });
    if (!product) {
      return res.status(404).json({ message: "상품이 존재하지 않습니다." });
    }

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

// 스웨거에서 DELETE에 요청 본문 넣지말라고 발작 일으키길래 한번 알아본 메모

// 1. DELETE 요청은 주로 리소스 삭제에 사용되며, 리소스 식별자는 URL에 포함 됨
// 2. DELETE에 요청 본문을 사용하는 것은 복잡성을 증가시킬 수 있고 일반적으로 필요하지 않음 (1번이 주된목적)
// 요청 본문(request body)을 사용해 DELETE 요청을 처리하는 것은 RESTful API 디자인과는 어긋나며, 예기치 않은 동작을 일으킬 수 있음
// 요청 본문을 쓸려면 특별한 사항이나 요구사항이 있어야하며, 문서화 하고 모든 관계자에게 명확히 알려야함
// 요청 본문에 비밀번호를 사용하고 있어서 특정 요구 사항을 충족하기 위한 것으로 보일 수 있으나 RESTful API 디자인과는 일치하지 않고 잠재적인 문제를 일으킬 수 있음

// 방법 1. 클라이언트가 비밀번호를 서버로 전송하고 서버에선 해당 비밀번호가 유효한지 유효성 검사만 하고 삭제 작업을 수행
// 방법 2. PUT 또는 PATCH 메서드로 리소스를 삭제하는 대신 상태를 변경하는 방식으로 구현 가능
// 리소스의 삭제 상태를 나타내는 새로운 필드를 추가하고 클라이언트는 해당 필드를 변경하여 리소스를 삭제 대기중 상태로 변경함
// 서버는 주기적으로 "삭제 대기중"상태인 리소스를 확인하고 비밀번호가 확인되면 리소스를 삭제
// 지금은 한번 이렇게 써보고 싶어서 한번 써보는 중인데 무슨 예기치 않은 동작이 발생할 수 있는걸까....요?
