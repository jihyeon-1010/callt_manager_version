const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const PORT = 8000;
const cors = require('cors'); 

app.use(cors());

// WebSocket 서버 생성
const wsServer = new WebSocket.Server({ server });

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/sendData', (req, res) => {
  const distance = req.body.distance;
  console.log(`distance: ${distance} cm`);
  
  // 소켓 방식으로 리액트에 센서값 전송
  wsServer.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(distance.toString());
    }
  });

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});