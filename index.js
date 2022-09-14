const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

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

async function createItemsIfNoneExist(itemList) {


	
}


app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));