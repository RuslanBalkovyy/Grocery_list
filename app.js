const { logger } = require("./util/logger");
const http = require("http");
const { handleRequest } = require("./routes");

const PORT = 3000;

const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  logger.info(`Server is listening on http://localhost:${PORT}`);
});
