const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const dear = require('./dearFuncs');

const app = express();
const port = 3000;

const TEST_ACC_ID = "853c0c88-3972-4d58-912a-ace3fabe873c";
const TEST_ACC_KEY = "71d7a00f-6ac6-bd30-e331-adf0526897b7";

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/create-order', async function(req, res) {

	// if body is not formatted correctly
		// send error

    let promiseList = [];
    let body = req.body;
    let linesTotal = 0;

    console.log(body)

	for(let line of body.Lines) {

		if(!line.ExistsInDear) {
			
			promiseList.push(dear.createItem(line.SKU, line.Name))
		}
        line.Total = line.Quantity * line.Price;
        linesTotal += line.Total;
	}

    if(!body.SupplierExistsInDear) {
        promiseList.push(dear.createSupplier(body.Supplier))
    }

    let list = await Promise.all(promiseList);

    for(let entry of list) {
        console.log(entry)
    }

    let additionalCost = body.OrderTotal - linesTotal;
    let response = await dear.uploadPO(body.Supplier, body.Lines, additionalCost, body.OrderTotal, "Created by Bryan's Non-PO Purchase Form")

    console.log(response);

    res.send(JSON.stringify({"uhh":'Thanks dude'}));
});

app.get('/create-order', (req, res) => {

    res.send('Thanks dude');
});


app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));



/*
{
    "Supplier": {
        "Name": "supplierVal",
        "ExistsInDear": false
    },
    "IsExpensifyPurchase": false,
    "AdditionalCost": 20.50,
    "OrderTotal": 100.50,
    "Lines": [
        {
            "SKU": "123",
            "Quantity": 2,
            "Price":40,
            "Total":80,
            "ExistsInDear": false
        }
    ]
}


      function getLineInfo(e) {

        return {
          SKU: e.querySelector('input[name="MPN="]').value,
          Description: e.querySelector('input[name="description"]').value,
          Quantity: e.querySelector('input[name="qty"]').value,
          Price: e.querySelector('input[name="price"]').value,
          ExistsInDear: items.itemList.includes(e.querySelector('input[name="MPN"]').value)
        }

*/