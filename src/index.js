const app = require('./app');
const { PORT } =  require('./config/config');
const logger = require('./utils/logger');

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});