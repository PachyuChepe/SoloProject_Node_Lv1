require("dotenv").config();
const mongoose = require("mongoose");

const DB_HOST = process.env.DATABASE_HOST;
const DB_PORT = process.env.DATABASE_PORT;
const DB_NAME = process.env.DATABASE_NAME;

// MongoDB에 연결하는 함수
const connect = () => {
  mongoose
    .connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`)
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
