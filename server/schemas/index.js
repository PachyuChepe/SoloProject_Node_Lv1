const env = require("../config/config");
const mongoose = require("mongoose");

// MongoDB에 연결하는 함수
const connect = () => {
  mongoose
    .connect(env.MongoDB_ATLAS)
    .then(() => {
      console.log("✅ Connected to MongoDB successfully");
    })
    .catch((err) => console.error("❌ MongoDB connection error", err));
};

// 연결 에러가 발생할 때의 처리
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error", err);
});

module.exports = connect;
