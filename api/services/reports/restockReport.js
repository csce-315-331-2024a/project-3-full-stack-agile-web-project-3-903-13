const db = require('../../config/db')

const generateRestockReport = (req, res) =>{
	db.query(
		"Select * FROM Inventory where count < mincount", (err,results)=>
		{
			if(err)
			{
				throw err;
			}
            // console.log(results);
			res.status(200).json(results.rows);
		}
	)


}

const fulfillRestock = async (req, res) => {

	// Extract any necessary data from the request body
	// const { itemIds } = req.body;

	// if (!itemIds || !Array.isArray(itemIds)) {
    //     return res.status(400).json({ message: 'Invalid or missing item IDs in request body' });
    // }

    // SQL query to update the count by adding mincount * 2 to the current count for items needing restock
    const updateQuery = `
    UPDATE Inventory
    SET count = count + (mincount * 2)
    WHERE count < mincount
	`;

    db.query(updateQuery, (err, result) => {
        if (err) {
            // Handle the error scenario
            console.error('Error updating inventory for restock:', err);
            return res.status(500).json({ message: 'Error updating inventory for restock' });
        }
        // If successful, send back a success response
        console.log('Inventory updated successfully for restock.');
        res.status(200).json({ message: 'Inventory updated successfully for restock', affectedRows: result.rowCount }); // Adjust based on your DB client
    });
}

module.exports = {
	generateRestockReport,
	fulfillRestock
}