const express = require('express');
const Product = require('../schemas/products.schema');
const router = express.Router();

// 상품 작성 (POST)
router.post('/products', async (req, res) => {
  try {
    if (!req.body) {
      return res
        .status(400)
        .json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
    }

    const { title, content, author, password } = req.body; // JSON
    // TODO: title ~ password까지 전부 꼼꼼하게 유효성 검사를 해주셔야 합니다. 하지만 여기선 시간 관계상 생략!

    const newProduct = new Product({
      title, // => title: title
      content,
      author,
      password,
      // status: 'FOR_SALE',
    });
    await newProduct.save();
    res.status(201).json({ message: '판매 상품을 등록하였습니다.' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ errorMessage: '예기치 못한 에러가 발생하였습니다.' });
    // TODO: 에러를 로깅해야 됩니다!
  }
});

// 상품 목록 조회 (GET)
router.get('/products', async (req, res) => {
  try {
    // 상품 목록은 작성 날짜를 기준으로 내림차순(최신순) 정렬
    const products = Product.find()
      .select('_id title author status createdAt')
      .sort({ createdAt: -1 });
    res.json({ message: products });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ errorMessage: '예기치 못한 에러가 발생하였습니다.' });
  }
});

// 상품 상세 조회 (GET)
router.get('/products/:productId', async (req, res) => {
  try {
    const product = Product.findById(req.params.productId).select(
      '_id title content author status createdAt',
    );

    if (!product) {
      return res
        .status(404)
        .json({ errorMessage: '상품 조회에 실패하였습니다' });
    }

    res.json({ message: product });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ errorMessage: '예기치 못한 에러가 발생하였습니다.' });
  }
});

// 상품 수정 (PUT)
router.put('/products/:productId', async (req, res) => {
  try {
    if (!req.body || !req.params) {
      return res
        .status(400)
        .json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
    }

    // TODO: title ~ password까지 전부 꼼꼼하게 유효성 검사를 할 것!
    const { title, content, password, status } = req.body;
    const product = Product.findById(req.params.productId).select(
      '_id title content author status createdAt',
    );

    if (!product) {
      return res
        .status(404)
        .json({ errorMessage: '상품 조회에 실패하였습니다' });
    }

    if (password !== product.password) {
      return res
        .status(401)
        .json({ errorMessage: '상품을 수정할 권한이 존재하지 않습니다.' });
    }

    product.title = title;
    product.content = content;
    product.status = status;

    await product.save();
    res.json({ message: '상품 정보를 수정하였습니다.' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ errorMessage: '예기치 못한 에러가 발생하였습니다.' });
  }
});

// 상품 삭제 (DELETE)
router.delete('/products/:productId', async (req, res) => {
  try {
    if (!req.body || !req.params) {
      return res
        .status(400)
        .json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
    }

    const productId = req.params.productId;
    const { password } = req.body;
    const product = Product.findById(req.params.productId).select(
      '_id title content author status createdAt',
    );

    if (!product) {
      return res
        .status(404)
        .json({ errorMessage: '상품 조회에 실패하였습니다' });
    }

    if (password !== product.password) {
      return res
        .status(401)
        .json({ errorMessage: '상품을 삭제할 권한이 존재하지 않습니다.' });
    }

    await product.deleteOne({ id: productId });
    res.json({ message: '상품을 삭제하였습니다.' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ errorMessage: '예기치 못한 에러가 발생하였습니다.' });
  }
});
