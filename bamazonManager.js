var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
 host: "localhost",
 port: 3306,
 user: "root",
 password: "Memookan$65",
 database: "bamazon"
});

connection.connect(function(err) {
 if (err) {
   console.error("error connecting: " + err.stack);
 }
 loadManagerMenu();
});

function loadManagerMenu() {
 connection.query("SELECT * FROM products", function(err, res) {
   if (err) throw err;
 
   loadManagerOptions(res);
 });
}

function loadManagerOptions(products) {
 inquirer
   .prompt({
     type: "list",
     name: "choice",
     choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"],
     message: "What would you like to do?"
   })
   .then(function(val) {
     switch (val.choice) {
       case "View Products for Sale":
         console.table(products);
         loadManagerMenu();
         break;
       case "View Low Inventory":
         loadLowInventory();
         break;
       case "Add to Inventory":
         addToInventory(products);
         break;
       case "Add New Product":
         addNewProduct(products);
         break;
       default:
         console.log("Goodbye!");
         process.exit(0);
         break;
     }
   });
}

function loadLowInventory() {
 connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function(err, res) {
   if (err) throw err;
   console.table(res);
   loadManagerMenu();
 });
}
function addToInventory(inventory) {
 console.table(inventory);
 inquirer
   .prompt([
     {
       type: "input",
       name: "choice",
       message: "What is the ID of the item you would you like add to?",
       validate: function(val) {
         return !isNaN(val);
       }
     }
   ])
   .then(function(val) {
     var choiceId = parseInt(val.choice);
     var product = checkInventory(choiceId, inventory);
    
     if (product) {
       promptManagerForQuantity(product);
     }
     else {
       console.log("\nThat item is not in the inventory.");
       loadManagerMenu();
     }
   });
}