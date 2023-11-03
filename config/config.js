require("dotenv").config();

module.exports = {
  SERVER_PORT: process.env.SERVER_PORT || 4000,
  MongoDB_LOCAL: `mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`,
  MongoDB_ATLAS: `mongodb+srv://${process.env.MA_DB_ID}:${process.env.MA_DB_PW}@${process.env.MA_DB_ID}.ngu1v3b.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`,
  // MongoDB_ATLAS_PORT: process.env.DATABASE_NAME,
};
