const { logger } = require('./util/logger');
const { loadGroceryList, saveGroceryList } = require('./storage');

let groceryList = loadGroceryList();

function getGroceryList() {
    return groceryList;
}


function addItem(name, quantity, price) {
    const newItem = { name, quantity, price, bought: false };
    groceryList.push(newItem);
    saveGroceryList(groceryList);
    logger.info(`Added item: ${name}`);
    return newItem;
}

function removeItem(index) {
    if (index >= 0 && index < groceryList.length) {
        const removedItem = groceryList.splice(index, 1)[0];
        saveGroceryList(groceryList);
        logger.info(`Removed ${removeItem.name} from the list.`)
        return removedItem;
    }
    return null;
}

function markAsBought(index) {
    if (index >= 0 && index < groceryList.length) {
        if (groceryList[index].bought) {
            logger.warn(`Item ${groceryList[index].name} is already marked as bought.`);
            return null;
        }
        groceryList[index].bought = true;
        saveGroceryList(groceryList);
        logger.info(`Marked ${groceryList[index].name} as bought`);
        return groceryList[index];
    }
    return null;
}



module.exports = {
    getGroceryList,
    addItem,
    removeItem,
    markAsBought
}