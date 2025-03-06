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

  function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data), null, 2);
  }


  if (req.url === "/groceries" && req.method === "GET") {
    sendResponse(res, 200, getGroceryList());
  } else if (req.url === "/groceries" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        const { name, quantity, price } = JSON.parse(body);
        if (!name || quantity == null || price == null) {
          sendResponse(res, 400, { error: "Invalid output" });
        }
        const newItem = addItem(name, quantity, price);
        sendResponse(res, 201, newItem);
      } catch (error) {
        sendResponse(res, 400, { error: "Invalid JSON" });
      }
    });
  } else if (req.url === "/groceries/" && req.method === "DELETE") {
    const index = parseInt(req.url.split('/')[2]);
    const removedItem = removeItem(index);
    if (removedItem) {
      sendResponse(res, 200, { message: "Item removed", item: removeItem });
    } else {
      sendResponse(res, 404, { error: "Item not found" });
    }
  } else if (req.url === "/groceries/" && req.method === "PATCH") {
    const index = parseInt(req.url.split('/')[2]);
    const markedItem = markAsBought(index);
    if (markedItem) {
      sendResponse(res, 200, { message: "Item marked as bought", item: markedItem });
    } else {
      sendResponse(res, 400, { error: "Invalid index or item already bought" });
    }
  }
  else {
    sendResponse(res, 404, { error: "Not found" });
  }

});

server.listen(PORT, () => {
  logger.info(`Server is listening on http://localhost:${PORT}`);
});
