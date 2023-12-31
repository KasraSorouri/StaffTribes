require('dotenv').config();

// Set Port
const PORT = process.env.PORT || 3003;

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI;

module.exports = {
  PORT,
  MONGODB_URI
};
