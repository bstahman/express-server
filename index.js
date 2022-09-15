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

	// await promiseall createSupplierIfNoneExists createItemsIfNoneExist




    console.log(req.body)

    res.send('Thanks dude');
});


/*
	@param: {string} supplierStr - string of supplier to create if none exists.
	@return: {boolean} returns true on success, false on failure
*/
async function createSupplierIfNoneExists(supplierStr) {

	// get list of suppliers from DEAR

	// if supplier param in list
		// return true

	// else
		// create new supplier

		//return true
}

/*
	@param: {array} itemList - list of items to create if none exist
	@return: {boolean} returns true on success, false on failure
*/
async function createItemsIfNoneExist(itemList) {

	// get list of items in dear

	// for each item in itemList
		// if item not in dearList
			// add to list of items to create

	// for item in list of items to create
		// create item in dear
		// append to list of promises


	
}


app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));