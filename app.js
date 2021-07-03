const express = require('express');

const morgan = require('morgan');
const dotenv = require('dotenv');

// app 생성
const app = express();
app.set('port', process.env.PORT || 8500);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(app.get('port'), () => {
  console.log(app.get('port'),'번 포트에서 대기중!');
})