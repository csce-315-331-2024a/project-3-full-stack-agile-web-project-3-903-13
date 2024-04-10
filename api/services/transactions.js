const db = require('../config/db')

const verifyOrderFormatting = (orderContents) => {
	var isValid = true
	orderContents.forEach((element) => {
		if (element.id === undefined || element.quantity === undefined) {
			isValid = false
		}
	});
	return isValid
}

const insertTransaction = async (totalCost, taxAmount) => {
	var currentDate = new Date().toLocaleString()

	try {
		const results = await db.query("INSERT INTO transactions values (DEFAULT, $1::timestamp, $2, $3) RETURNING transactionid", [currentDate,totalCost,taxAmount])
		return results.rows[0].transactionid
	} catch (err) {
		console.log(err)
	}
}

const updateFoodItemsTable = async (id, orderContents) => {
    for (const item of orderContents) {
        try {
            await db.query("INSERT INTO fooditems VALUES (DEFAULT, $1, $2, $3)", [id, item.id, item.quantity]);
        } catch (err) {
            // console.error(err);
            throw err; // Re-throw the error to handle it in the caller function
        }
    }
};

const decrementInventory = async (orderContents) => {
	orderContents.map(async (item) => {
		// Get entries from ingredients table (tells which menu items use which inventory items)
		try {
			const results = await db.query("SELECT inventid, quantity FROM ingredients WHERE menuid = $1", [item.id])
			results.rows.map((inventory) => {
				db.query("UPDATE inventory SET count = count - $1 WHERE inventid = $2", [item.quantity*inventory.quantity, inventory.inventid])
			})
		} catch (err) {
			console.log(err)
		}
	})
}

const createTransaction = async (req,res) => {
	const totalCost = req.body.totalCost
	const taxAmount = req.body.taxAmount
	const orderContents = req.body.orderContents
	
	if (!totalCost || !taxAmount || !orderContents) {
		res.status(400).send("Missing parts of request")
		return
	}

	const valid = verifyOrderFormatting(orderContents)
	console.log(valid)
	if (!valid) {
		res.status(400).send("Invalid formatting of error contents.")
		return
	}
	
	try {
		const transactionid = await insertTransaction(totalCost,taxAmount)
		res.status(200).send("Successfully added transaction to database")
		updateFoodItemsTable(transactionid, orderContents)
		decrementInventory(orderContents)
	} catch (error) {
		console.log(error)	
	}
}

module.exports = {
    createTransaction,
    insertTransaction,
    updateFoodItemsTable,
    decrementInventory
}
