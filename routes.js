const { logger } = require("./util/logger");
const { getGroceryList, addItem, removeItem, markAsBought } = require("./groceryService");

function sendResponse(res, statusCode, data) {
    if (!res.writableEnded) {
        res.writeHead(statusCode, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data, null, 2));
    }
}

function handleRequest(req, res) {
    if (!req.url.startsWith("/groceries")) {
        return sendResponse(res, 404, { error: "Not found" });
    }

    let parts = req.url.split("/");
    let index = parts.length > 2 ? parseInt(parts[2]) : null;
    let body = "";

    req.on("data", (chunk) => { body += chunk; });

    req.on("end", () => {
        try {
            body = body.length > 0 ? JSON.parse(body) : {};

            switch (req.method) {
                case 'GET':
                    return sendResponse(res, 200, getGroceryList());

                case 'POST':
                    if (!body.name || body.quantity == null || body.price == null) {
                        return sendResponse(res, 400, { error: "Invalid input" });
                    }
                    const newItem = addItem(body.name, body.quantity, body.price);
                    return sendResponse(res, 201, newItem);

                case 'DELETE':
                    if (index === null || isNaN(index)) {
                        return sendResponse(res, 400, { error: "Invalid index" });
                    }
                    const removedItem = removeItem(index);
                    return removedItem
                        ? sendResponse(res, 200, { message: "Item removed", item: removedItem })
                        : sendResponse(res, 404, { error: "Item not found" });

                case 'PATCH':
                    if (index === null || isNaN(index)) {
                        return sendResponse(res, 400, { error: "Invalid index" });
                    }
                    const groceryList = getGroceryList();
                    if (index >= groceryList.length) {
                        return sendResponse(res, 404, { error: "Item not found" });
                    }
                    if (groceryList[index].bought) {
                        return sendResponse(res, 400, { error: "Item already bought" });
                    }
                    const markedItem = markAsBought(index);
                    return markedItem
                        ? sendResponse(res, 200, { message: "Item marked as bought", item: markedItem })
                        : sendResponse(res, 400, { error: "Invalid index or item already bought" });

                default:
                    return sendResponse(res, 405, { error: "Method not allowed" });
            }
        } catch (error) {
            return sendResponse(res, 400, { error: "Invalid JSON", message: `${error}` });
        }
    });

    req.on("error", (err) => {
        logger.error(`Request error: ${err.message}`);
        sendResponse(res, 500, { error: "Internal server error" });
    });
}

module.exports = { handleRequest };
