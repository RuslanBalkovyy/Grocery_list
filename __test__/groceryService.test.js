const { addItem, removeItem, markAsBought } = require('../groceryService');
const { logger } = require('../util/logger');
const { loadGroceryList, saveGroceryList } = require('../storage');

jest.mock('../util/logger');
jest.mock('../storage');
jest.mock('../storage');

describe("Grocery service testing:", () => {
    //TODO actuallt write tests
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("add item returning correct item", () => {

    });
    test("remove item returning correct item", () => {

    });
    test("add item return null when wrong index", () => {

    });
    test("mark as bought return null if already bought", () => {

    });
    test("mark as bought return null if wrong index", () => {

    });
    test("mark as bought return index of marked item", () => {

    });


})