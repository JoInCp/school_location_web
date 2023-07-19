const express = require('express');
const path = require('path');
const fs = require('fs');
const logger = require("./src/config/logger");
const requestIP = require('request-ip');

const app = express();
const port = 80;

// 정적 파일 제공을 위한 미들웨어 설정
app.use(express.static(path.join(__dirname)));

// 홈 라우트 핸들러
app.get('/', (req, res) => {
  const ipAddress = requestIP.getClientIp(req);
  logger.info(`[ ${ipAddress} ]: GET / "main"`);
  res.sendFile(path.join(__dirname, './src/public/index.html'));
});

// 검색 라우트 핸들러
app.get('/search', (req, res) => {
  const ipAddress = requestIP.getClientIp(req);
  logger.info(`[ ${ipAddress} ]: GET / "search"`);
  // 검색 로직 구현
  const searchValue = req.query.searchValue;

  // data.json 파일에서 데이터 가져오기
  fs.readFile(path.join(__dirname, 'data.json'), 'utf-8', (err, data) => {
    if (err) {
      logger.error('데이터를 불러오는 중 오류가 발생했습니다.');
      res.json({ list: [] }); // 에러 발생 시 빈 배열 반환
      return;
    }

    const jsonData = JSON.parse(data);
    const results = jsonData.list.filter(item => {
      const subjectMatch = item.subject.toLowerCase().includes(searchValue.toLowerCase());
      const nameMatch = item.name.toLowerCase().includes(searchValue.toLowerCase());
      return subjectMatch || nameMatch;
    });

    res.json({ list: results });
  });
});

// 서버 시작
app.listen(port, () => {
  logger.info(`[ ${port} ]번 포트 서버 가동`);
});
