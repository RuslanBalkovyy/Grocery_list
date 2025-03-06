const fs = require('fs');
const { logger } = require('./util/logger');

const DATA_FILE = "./util/data/data.json"

let groceryList = [];

function loadGroceryList() {


    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                logger.warn('No existing grocery list found. Starting fresh.');
                groceryList = [];
                return;
            }
            logger.error('Error loading grocery list: ' + err.message);
            return;
        }
        try {
            groceryList = JSON.parse(data);
            logger.info('Grocery list loaded successfully.');
        } catch (parseError) {
            logger.error('Error parsing grocery list: ' + parseError.message);
            groceryList = [];
        }
    });



}

function saveGroceryList() {
    fs.writeFile(DATA_FILE, JSON.stringify(groceryList, null, 2), 'utf8', (err) => {
        if (err) {
            logger.error(`Error when sawing grocery list: ${err.message}`);
        }
        else {
            logger.info(`Grocery list saved successfully.`);
        }
    });
}

function getGroceryList() {
    return groceryList;
}

function addItem(name, quantity, price) {
    const newItem = { name, quantity, price, bought: false };
    groceryList.push(newItem);
    saveGroceryList();
    logger.info(`Added item: ${name}`);
    return newItem;
}

function removeItem(index) {
    if (index >= 0 && index < groceryList.length) {
        const removedItem = groceryList.splice(index, 1)[0];
        saveGroceryList();
        logger.info(`Removed ${removeItem.name} from the list.`)
        return removedItem;
    }
    return null;
}

function markAsBought(index) {
    if (index >= 0 && index < groceryList.length) {
        groceryList[index].bought = true;
        saveGroceryList();
        logger.info(`Marked ${groceryList[index].name} as bought`);
        return groceryList[index];
    }
    return null;
}

loadGroceryList();

module.exports = {
    getGroceryList,
    addItem,
    removeItem,
    markAsBought
}