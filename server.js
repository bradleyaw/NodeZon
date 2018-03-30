// dependencies
var inquirer = require("inquirer");
var mysql = require("mysql");



// creating databse connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "nodezon"
});

// main function
function productInit() {
    // get data we need from mysql database
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("\n-------------------------------------");
        console.log("Here are our available products\n");
        console.log("Item ID    Item Price      Item Name")
        // display the data we want for users to see
        for (var i = 0; i < res.length; i++) {
            console.log("   " + res[i].id + "          " + res[i].price + "             " + res[i].item)
        };
        console.log("\n-------------------------------------\n");
        // prompt user for their input
        inquirer.prompt([
            {
                message: "Please select the ID of the item you'd like to order.",
                type: "input",
                name: "idSelect",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                message: "How many items would you like to purchase?",
                type: "input",
                name: "quantitySelect",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (inqResp) {
            // set several variables to hold response data
            var itemPurchased = res[inqResp.idSelect].item
            var userQuantity = inqResp.quantitySelect
            var dbQuantity = res[inqResp.idSelect].quantity
            var cost = res[inqResp.idSelect].price * userQuantity;
            // if we have enough stock...
            if (userQuantity <= dbQuantity) {
                //update our database with new numbers
                connection.query("UPDATE products SET ? WHERE ?", [{ quantity: dbQuantity - userQuantity}, { item: itemPurchased }], function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " quantities updated!\n");
                    console.log("-------------------------------------");
                });
                console.log("Thank you for your money!");
                console.log("Your purchase of " + userQuantity + " " + itemPurchased + "(s) has been made for a total of $" + cost + ".");
                productInit();
            // if the order is too big...
            } else if (userQuantity > dbQuantity) {
                console.log("insufficient quantity");
                productInit();
            } else {
                console.log("Not sure how you messed this up...");
            }
            
    
    
        });
    })
}
productInit();