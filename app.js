const { logger } = require("./util/logger");
const {
  getGroceryList,
  addItem,
  removeItem,
  markAsBought,
} = require("./groceryService");
const http = require("http");

const PORT = 3000;

const server = http.createServer((req, res) => {

  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  })
    .on("end", () => {
      body = body.length > 0 ? JSON.parse(body) : {};
    })


  function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data), null, 2);
  }

  if (req.url.startsWith("/groceries")) {
    logger.info(req.url.split("/"));
    let parts = req.url.split("/");
    let index = parts.length > 2 ? parseInt(parts[2]) : null;

    switch (req.method) {
      case 'GET':
        sendResponse(res, 200, getGroceryList());
        break;
      case 'POST':
        req.on("end", () => {
          try {
            const { name, quantity, price } = body;
            if (!name || quantity == null || price == null) {
              sendResponse(res, 400, { error: "Invalid output" });
            }
            const newItem = addItem(name, quantity, price);
            sendResponse(res, 201, newItem);
          } catch (error) {
            sendResponse(res, 400, { error: "Invalid JSON", message: `${error}` });
          }
        });
        break;
      case 'DELETE':
        const removedItem = removeItem(index);
        if (removedItem) {
          sendResponse(res, 200, { message: "Item removed", item: removeItem });
        } else {
          sendResponse(res, 404, { error: "Item not found" });
        }
        break;
      case 'PATCH':
        const markedItem = markAsBought(index);
        if (markedItem) {
          sendResponse(res, 200, { message: "Item marked as bought", item: markedItem });
        } else {
          sendResponse(res, 400, { error: "Invalid index or item already bought" });
        }
        break;
      default:
        sendResponse(res, 405, { error: "Method not allowed" });
    }

  } else {
    sendResponse(res, 404, { error: "Not found" });
  }

});

server.listen(PORT, () => {
  logger.info(`Server is listening on http://localhost:${PORT}`);
});
