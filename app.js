const express = require("express");
const app = express();
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");

// 환경 설정 및 데이터베이스 연결
const env = require("./config/config");
const connect = require("./schemas");
connect();

// Swagger API 문서 로드
const apiSpec = YAML.load("swagger.yaml");

// 미들웨어 설정
app.use(express.json());

// API 문서 노출
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiSpec));

// 루트 경로
app.get("/", (req, res) => {
  res.send("안녕하세요 세계!");
});

app.use(
  cors({
    origin: [
      "https://localhost:3000",
      "http://localhost:3000",
      "http://node-solo-lv1.kro.kr/",
      "https://node-solo-lv1.kro.kr/",
    ],
    credentials: true,
  })
);

// 제품 관련 라우터 설정
const productsSchema = require("./routes/productsRouter");
app.use("/api", [productsSchema]);

// 서버 설정
let server;
if (fs.existsSync("./key.pem") && fs.existsSync("./cert.pem")) {
  // HTTPS 서버 설정
  const privateKey = fs.readFileSync(__dirname + "/key.pem", "utf8");
  const certificate = fs.readFileSync(__dirname + "/cert.pem", "utf8");
  const credentials = { key: privateKey, cert: certificate };
  server = https.createServer(credentials, app);
  server.listen(env.SERVER_PORT, () => console.log(`HTTPS server is running on port ${env.SERVER_PORT} `));
} else {
  // HTTP 서버 설정
  server = app.listen(env.SERVER_PORT, () => console.log(`HTTP server is running on port ${env.SERVER_PORT}`));
}

module.exports = server;

// Q1. 수정 및 삭제 API에서 Resource를 구분하기 위해서 어떤 방식으로 요청(Request) 하셨나요?
// A1. URL 경로의 일부로 존재하는 userItemId 파라미터를 만들어서 리소스를 고유하게 식별할 수 있게 만들었습니다.

// Q2. 대표적인 HTTP Method의 4가지( `GET`, `POST`, `PUT`, `DELETE` )는 각각 어떤 상황에서 사용하였나요?
// A2. GET: 상품 전체 목록 조회 및 상세 조회에 사용했습니다.
// A2. POST: 상품 등록에 사용했습니다.
// A2. PUT: 소유권이 확인된(비밀번호) 아이템의 정보 수정에 사용했습니다
// A2. DELETE: 소유권이 확인된(비밀번호) 상품을 삭제하는데 사용했습니다.

// Q3. API 설계 시 RESTful한 원칙을 따랐나요? 어떤 부분이 RESTful한 설계를 반영하였고, 어떤 부분이 그렇지 않았나요?
// A3. URL 엔드포인트를 작성할때 용도에 맞게 나누고 전체조회는 복수로, 상세조회는 단수로 구분했습니다
// A3. CRUD에 맞춰서 get, post, put, delete를 사용했습니다
// A3. delete에 요청 본문(Request body)이 들어가는데 이것은 RESTful한 원칙에서 벗어나는거 같습니다 (productsRouter.js에 상세기재)
// A3. 아직 RESTful한 원칙이란게 명확하게 와닿질않아서 이 외에 놓친게 있는진 잘 모르겠습니다

// Q4. 폴더 구조(Directory Structure)를 역할별로 분리하였다면, 어떤 이점을 가져다 주었을까요?
// A4. 코드의 모듈화 및 유지보수가 더 쉬워집니다 (코드 가독성 및 재사용성 향상)

// Q5. `mongoose`에서 상품 상태는 어떠한 방식으로 관리하였나요? 이 외에도 어떤 방법들이 있었을까요?
// A5. status는 각 상품의 현재 상태를 나타내며, 필요에 따라 업데이트 하는 방식으로 관리되고 있습니다.
//     이 외의 방법으론 숫자나 문자열 대신 열거형(enum)으로도 관리할 수 있습니다.
//     정해진 값 집합(판매 대기, 판매 중, 판매 완료)을 사용하여 상태관리를 하면 고정된 값을 가지기에 오타나 잘못된 상태 값 입력을 방지할 수 있고
//     정해진 값을 사용하기에 유효성 검사로 특정 값이 유효한지 확인 또한 가능합니다. (구글링)
