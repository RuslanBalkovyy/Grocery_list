const { logger } = require('./util/logger');
const { fsHandling } = require('./util/fs_handling')
const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {

})


server.listen(PORT, () => {
  logger.info(`Server is listening on http://localhost:${PORT}`);
});