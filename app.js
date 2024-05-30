require('dotenv').config();
const express = require('express');
const connect = require('./schemas');

const app = express();
app.use(express.json());

connect();

const router = require('./routes/products.router.js');
app.use('/api', router);

app.listen(process.env.SERVER_PORT, () => {
  console.log('서버가 새로 띄워졌네요!');
});
