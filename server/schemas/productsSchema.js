const mongoose = require("mongoose");
const userItemMiddleware = require("../middleware/userItemMiddleware.js");

const userItemSchema = new mongoose.Schema({
  userItemId: {
    type: Number,
    required: true,
    unique: true,
    default: 0,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// userItemId 카운트 미들웨어
userItemSchema.plugin(userItemMiddleware);
// userItemSchema.pre("save", async function (next) {
//   if (!this.userItemId) {
//     try {
//       const maxUserItemId = await this.constructor.findOne({}, { userItemId: 1 }, { sort: { userItemId: -1 } });
//       this.userItemId = maxUserItemId ? maxUserItemId.userItemId + 1 : 1;
//     } catch (error) {
//       return next(error);
//     }
//   }
//   next();
// });

module.exports = mongoose.model("UserItem", userItemSchema);
