var http = require("https");
var fs = require('fs');

const TEST_ACC_ID = "853c0c88-3972-4d58-912a-ace3fabe873c";
const TEST_ACC_KEY = "71d7a00f-6ac6-bd30-e331-adf0526897b7";

async function makeGetRequest(path) {

    var options = {
        "method": "GET",
        "hostname": "inventory.dearsystems.com",
        "port": null,
        "path": path,
        "headers": {
        "accept": "application/json",
        "content-type": "application/json",
        'api-auth-accountid': TEST_ACC_ID,
        'api-auth-applicationkey': TEST_ACC_KEY,
        }
    };

    return new Promise((resolve, reject) => {

        var req = http.request(options, function (res) {
          var chunks = [];

          res.on("data", function (chunk) {
            chunks.push(chunk);
          });

          res.on("end", function () {

            var body = Buffer.concat(chunks);

            resolve(JSON.parse(body));

          });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.end();

    });

}

async function makePostRequest(path, body, stringifyFlag) {

    var options = {
        "method": "POST",
        "hostname": "inventory.dearsystems.com",
        "port": null,
        "path": path,
        "headers": {
        "accept": "application/json",
        "content-type": "application/json",
        'api-auth-accountid': TEST_ACC_ID,
        'api-auth-applicationkey': TEST_ACC_KEY,
        }
    };

    return new Promise((resolve, reject) => {

        var req = http.request(options, function (res) {
          var chunks = [];

          res.on("data", function (chunk) {
            chunks.push(chunk);
          });

          res.on("end", function () {

            var body = Buffer.concat(chunks);

            resolve(JSON.parse(body));

          });
        });

        req.on('error', (e) => {
            reject(e);
        });


        req.write(body);

        req.end();

    });

}

async function uploadPO(supplier, lines, additionalCost, orderTotal, note) {

    console.log(lines)

    let bodyCreate = JSON.stringify({

        Supplier: supplier,
        Approach: "INVOICE",
        Location: "Main Warehouse",
        PurchaseType: "Advanced",
        Note: note,
    });

    let response1 = await makePostRequest('/ExternalApi/v2/advanced-purchase', bodyCreate);

    let bodyLines = JSON.stringify({

        "TaskID": response1.ID,
        "Status": "DRAFT",
        "Lines": lines,
        "Total": orderTotal,
        "AdditionalCharges" : additionalCost != 0 ? [{
                                                        Description: "Additional Costs",
                                                        Price: additionalCost,
                                                        Quantity: 1,
                                                        Total: additionalCost,
                                                        TaxRule: "Tax Exempt"
                                                    }] : null,
    });

    let response2 = await makePostRequest('/ExternalApi/v2/purchase/order', bodyLines);

    return { response1: response1, response2: response2 };

}

/*
	@param: {string} supplierStr
	@return: {Promise} 
*/
async function createSupplier(supplierStr) {

	let body = {

		Name: supplierStr,
		Currency: "USD",
		TaxRule: "Tax Exempt",
		PaymentTerm: "30 days",
		AccountPayable: "2000",
		Status: "Active",
		Comments: "Created by Bryan's Non-PO Purchase Form"
	}

	return makePostRequest('/ExternalApi/v2/supplier', JSON.stringify(body));

}

async function createItem(SKU, name) {

    console.log("------------")
    console.log(name)

	let body = { 
                    SKU: SKU,
    				Name: name,
    				Type: "Stock",
    				UOM: "Item",
    				CostingMethod: "FIFO",
    				PriceTiers: {Tier1:0},
    				Status: "Active",
    				InventoryAccount: "1400",
    				InternalNote: "Created by Bryan's Non-PO Purchase Form"
			};

	return makePostRequest('/ExternalApi/v2/product', JSON.stringify(body));

}

module.exports = { createItem, createSupplier, uploadPO };


/*

async function wrapper() {

    await Promise.all([createSupplier("Clayton"),createItem("new item","new descrip")])

    let lines = [
        {
            SKU: "new item",
            Quantity: 2,
            Price: 5,
            Total: 10,
        }
    ];

    let resp = await uploadPO(supplier = "Macron", lines, 10, 20, note = "nooote");

    console.log(resp)

}

async function test() {

    let promiseList = [];

    for(let i = 5; i < 15; i++) {

        let obj = { SKU: `TESTING3${i}`,
                    Name: `TESTING3${i}`,
                    Type: "Stock",
                    UOM: "Item",
                    CostingMethod: "FIFO",
                    PriceTiers: {Tier1:0},
                    Status: "Active",
                    InventoryAccount: "1400",
                };
        promiseList.push(makePostRequest('/ExternalApi/v2/product',obj));
    }

    let x = await Promise.all(promiseList);

    console.log(x)

    console.log("done")

}
*/