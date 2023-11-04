const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors(),express.json());


app.get('/ping', (req, res) => {
  res.send('pong');
});

module.exports = app;