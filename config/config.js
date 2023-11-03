require("dotenv").config();

module.exports = {
  SERVER_PORT: process.env.SERVER_PORT || 4000,
  MongoDB_LOCAL: `mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`,
  MongoDB_ATLAS: "없어! 지금은!",
};
