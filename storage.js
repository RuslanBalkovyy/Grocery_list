const fs = require('fs');
const { logger } = require("./util/logger");

const DATA_FILE = "./util/data/data.json";

function loadGroceryList() {

    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, "utf8");
            logger.info(`Grocery list successfully parsed`);
            const groceryList = JSON.parse(data);
            logger.info(`Grocery list loaded successfully.`);
            return groceryList;
        }
        else {
            logger.warn(`No existing groccery list. Starting fresh.`);
            return [];
        }

    } catch (error) {
        logger.error(`Error while processing grocery list: ${error.message}`)
        return [];
    }

}

function saveGroceryList(groceryList) {
    fs.writeFile(DATA_FILE, JSON.stringify(groceryList, null, 2), "utf8", (err) => {
        if (err) {
            logger.error(`Error while saving grocery list: ${err.message}`);
        }
        else {
            logger.info(`Grocery list saved successfully.`);
        }
    });
}

module.exports = {
    loadGroceryList,
    saveGroceryList
}