const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    // 제목
    title: { type: String, required: true },
    // 내용
    content: { type: String, required: true },
    // 작성자
    author: { type: String, required: true },
    // 비밀번호
    password: { type: String, required: true },
    // 제품상태
    status: {
      type: String,
      enum: ['FOR_SALE', 'SOLD_OUT'],
      default: 'FOR_SALE',
    },
  },
  { timestamps: true },
);

const Product = mongoose.model('Product', schema);
module.exports = Product;
