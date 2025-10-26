const app = require('./src/app.js');
const http = require('http');
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
 
require('./src/socket.js').intializeSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
}); 