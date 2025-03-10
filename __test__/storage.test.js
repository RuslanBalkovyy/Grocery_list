const fs = require('fs');
const { loadGroceryList, saveGroceryList } = require('../storage');
const { logger } = require('../util/logger');

jest.mock('fs');
jest.mock('../util/logger');


const mockData = JSON.stringify([{ name: "Milk", quantity: 2, price: 2.99, bought: false }]);
const DATA_FILE = './util/data/data.json';

describe("Storage tests, loadGroceryList(): ", () => {



    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Load groceries list, file not exist", () => {
        fs.existsSync.mockReturnValue(false);

        const groceryList = loadGroceryList();
        expect(fs.existsSync).toHaveBeenCalledWith(DATA_FILE);
        expect(logger.warn).toHaveBeenCalledWith(`No existing groccery list. Starting fresh.`);
        expect(groceryList).toEqual([]);
    });

    test("Load groceries list, file exist", () => {
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockReturnValue(mockData);

        const groceryList = loadGroceryList();
        expect(logger.info).toHaveBeenCalledWith(`Grocery list successfully parsed`);
        expect(logger.info).toHaveBeenCalledWith(`Grocery list loaded successfully.`);
        expect(groceryList).toStrictEqual([{ name: "Milk", quantity: 2, price: 2.99, bought: false }]);
    });

    test("Load groceries list, error occurs", () => {
        fs.existsSync.mockImplementation(() => {
            throw new Error("Test Error");
        });

        const groceryList = loadGroceryList();

        expect(logger.error).toHaveBeenCalledWith(`Error while processing grocery list: Test Error`);
        expect(groceryList).toEqual([]);

    })
});

describe("Storage tests: saveGroceryList()", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    test("Saving list to json successfully", () => {
        const groceryList = { name: "Milk", quantity: 5 };

        fs.writeFile = jest.fn((data, jsonStr, coding, callback) => {
            callback(null);
        });

        saveGroceryList(groceryList);
        expect(fs.writeFile).toHaveBeenCalledWith(DATA_FILE, JSON.stringify(groceryList), "utf8", expect.any(Function));
        expect(logger.info).toHaveBeenCalledWith(`Grocery list saved successfully.`);



    });

    test("Saving list to throw error", () => {
        const groceryList = { name: "Milk", quantity: 5 };
        fs.writeFile = jest.fn((data, jsonStr, coding, callback) => {
            callback(new Error("test error"));
        });

        saveGroceryList(groceryList);
        expect(logger.error).toHaveBeenCalledWith('Error while saving grocery list: test error');

    })
});