const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let groceryList = [];

function clearScreen() {
  console.clear();
}

function pause(callback) {
  rl.question("\nPress Enter to continue...", () => {
    callback();
  });
}

function displayMenu() {
  clearScreen();
  console.log("Grocery Shopping Tracker");
  console.log("1. View Grocery List");
  console.log("2. Add Item");
  console.log("3. Remove Item");
  console.log("4. Mark Item as Bought");
  console.log("5. Exit");
  rl.question("Choose an option: ", handleMenuChoice);
}

function displayList() {
  if (groceryList.length === 0) {
    console.log("Your grocery list is empty.");
  } else {
    console.log("Grocery List:");
    groceryList.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} - ${item.quantity} @ $${item.price.toFixed(2)} - ${item.bought ? 'Bought' : 'Not Bought'}`);
    });
  }
}

function handleMenuChoice(choice) {
  switch (choice) {
    case '1':
      clearScreen();
      displayList();
      pause(displayMenu);
      break;
    case '2':
      rl.question("Enter item name: ", (name) => {
        rl.question("Enter quantity: ", (quantity) => {
          rl.question("Enter price: ", (price) => {
            groceryList.push({ name, quantity: Number(quantity), price: Number(price), bought: false });
            console.log(`${name} has been added to your grocery list.`);
            pause(displayMenu);
          });
        });
      });
      break;
    case '3':
      clearScreen();
      if (groceryList.length === 0) {
        console.log("Your grocery list is empty.");
        pause(displayMenu);
      } else {
        displayList();
        rl.question("Enter item number to remove: ", (index) => {
          index = Number(index) - 1;
          if (index >= 0 && index < groceryList.length) {
            let removedItem = groceryList.splice(index, 1);
            console.log(`${removedItem[0].name} has been removed.`);
          } else {
            console.log("Invalid item number.");
          }
          pause(displayMenu);
        });
      }
      break;
    case '4':
      clearScreen();
      let availableItems = groceryList.filter(item => !item.bought);
      if (availableItems.length === 0) {
        console.log("No items available to mark as bought.");
        pause(displayMenu);
      } else {
        console.log("Available Items to Mark as Bought:");
        availableItems.forEach((item, index) => {
          console.log(`${index + 1}. ${item.name} - ${item.quantity} @ $${item.price.toFixed(2)}`);
        });

        rl.question("Enter item number to mark as bought: ", (num) => {
          let index = Number(num) - 1;
          if (index >= 0 && index < availableItems.length) {
            let itemToMark = availableItems[index];
            groceryList[groceryList.indexOf(itemToMark)].bought = true;
            console.log(`${itemToMark.name} is now marked as bought.`);
          } else {
            console.log("Invalid item number.");
          }
          pause(displayMenu);
        });
      }
      break;
    case '5':
      console.log("Goodbye!");
      rl.close();
      break;
    default:
      console.log("Invalid choice. Please try again.");
      pause(displayMenu);
      break;
  }
}


clearScreen();
displayMenu();
