const db = require('../config/db')

const addEmployee = (req,res) => {
	db.query(`INSERT INTO employees VALUES(default, '${req.body.name}', ${req.body.age}, '${req.body.phone}', ${req.body.hours}, 'f', 1111, '${req.body.role}')`, (err,results) => {
		if (err) {
			console.log(err)
			res.status(500).send("Could not add employee")
			return
		}
		res.status(200).send("Employee added successfully")
	}) 
}

const retrieveEmployees = (req,res) => {
	db.query("SELECT * FROM employees ORDER BY employeeid ASC", (err,results) => {
		if (err) {
			res.status(500).send("Internal Server Error");
			return;
		}
		res.status(200).json(results.rows)
	})
}

const deleteEmployee = (req, res) => {
	db.query(`DELETE FROM employees WHERE employeeid = ${req.params.id}`, (err, results) => {
		if (err) {
			res.status(500).send("Internal Server Error")
			return;
		}
		res.status(200).send("Succesfully deleted user")
		return;
	})
}

const updateEmployee = (req,res) => {
	db.query(`UPDATE employees
	SET employeeage = ${req.body.age}, employeephonenumber = '${req.body.phone}', employeehours = ${req.body.hours}, role = '${req.body.role}' WHERE employeeid = ${req.body.id}
	`, (err, results) => {
			if (err) {
				 console.log(err)
				res.status(500).send("Internal Server Error")
				return
			}
			res.status(200).send("Successfuly updated user")
			return
	})
}

module.exports = {
	addEmployee,
	retrieveEmployees,
	deleteEmployee,
	updateEmployee,
};
