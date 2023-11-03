const fs = require("fs");
const https = require("https");
const express = require("express");
const app = express();
const env = require("./config/config");
// const goodsRouter = require("./routes/goods.js");
// const cartsRouter = require("./routes/carts.js");

const connect = require("./schemas");
connect();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("안녕하세요 세계!");
});

// app.use("/api", [goodsRouter, cartsRouter]);
// const env.SERVER_PORT = process.env.SERVER_PORT || 4000;

// 인증서가 존재하면 HTTPS, 그렇지 않을 경우 HTTP
let server;
if (fs.existsSync("./key.pem") && fs.existsSync("./cert.pem")) {
  const privateKey = fs.readFileSync(__dirname + "/key.pem", "utf8");
  const certificate = fs.readFileSync(__dirname + "/cert.pem", "utf8");
  const credentials = { key: privateKey, cert: certificate };

  server = https.createServer(credentials, app);
  server.listen(env.SERVER_PORT, () => console.log(`HTTPS server is running on port ${env.SERVER_PORT} `));
} else {
  server = app.listen(env.SERVER_PORT, () => console.log(`HTTP server is running on port ${env.SERVER_PORT}`));
}
module.exports = server;
