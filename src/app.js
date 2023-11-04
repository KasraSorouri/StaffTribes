const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose').set('strictQuery',false);

const config = require('./config/config');
const logger = require('./utils/logger');

const app = express();
app.use(cors(),express.json());

// connect to Database
logger.info('Connecting to Database ...');
try {
  mongoose.connect(config.MONGODB_URI);
  logger.info(`Connected to ${config.MONGODB_URI}`);
} catch (err) {
  logger.error('Error connecting to Database: ', err.message );
}


app.get('/ping', (req, res) => {
  res.send('pong');
});

module.exports = app;