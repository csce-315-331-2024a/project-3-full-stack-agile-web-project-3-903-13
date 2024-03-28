const db = require('../config/db')

const getRestockReport = (req, res) =>{
	db.query(
		"Select * FROM Inventory where count < mincount", (err,results)=>
		{
			if(err)
			{
				throw err;
			}
            console.log(results);
			res.status(200).json(results.rows);
		}


	)


}

module.exports = {
	getRestockReport
}