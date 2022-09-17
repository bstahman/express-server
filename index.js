const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

const TEST_ACC_ID = "853c0c88-3972-4d58-912a-ace3fabe873c";
const TEST_ACC_KEY = "71d7a00f-6ac6-bd30-e331-adf0526897b7";

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/create-order', (req, res) => {

	// if body is not formatted correctly
		// send error

	for(let line of req.Lines) {

		if(!line.ExistsInDear) {
			
			
		}

	}

	// await promiseall createSupplierIfNoneExists createItemsIfNoneExist




    console.log(req.body)

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



*/