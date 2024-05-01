// routes/employees.js
const express = require('express')
const router = express.Router()
const employeesController = require('../services/employees')

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: API for managing Rev's employees
 *	/employees:
 *	  get:
 *	    summary: Get list of all employees at Rev's
 *	    tags: [Employees]
 *	    responses:
 *	      200:
 *	        description: List of all employees at Rev's
 *	        content:
 *	          application/json:
 *	            schema: 
 *	              type: array
 *	            example:
 *	              employeeid: 1
 *	              employeename: John
 *	              employeeage: 23
 *	              employeephonenumber: (123) 456-7890
 *	              employeehours: 40
 *	              ismanager: f
 *	              pin: 1234
 *	              role: kitchen
 *	              email: john@gmail.com
 *	      500:
 *	        description: Internal Server Error
 *	  post:
 *	    summary: Add a new employee to the database
 *	    tags: [Employees]
 *	    requestBody:
 *	      required: true
 *	      content: 
 *	        application/json:
 *	          example:
 *	            name: John
 *	            age: 30
 *	            phone: (123) 456-7890
 *	            hours: 40
 *	            role: kitchen
 *	            email: john@gmail.com
 *	    responses:
 *	      200:
 *	        description: Employee added successfully
 *	      500:
 *	        description: Internal Server Error
 *	/employees/role:
 *	  post:
 *	    summary: Retrieve role of employee given their email	
 *	    tags: [Employees]
 *	    requestBody:
 *	      required: true
 *	      content:
 *	        application/json:
 *	          example:
 *	            email: john@gmail.com 
 *	    responses:
 *	      200:
 *	        description: Role of employee with given email
 *	        content:
 *	          application/json:
 *	            example:
 *	              [role: kitchen]
 *	      500:
 *	        description: Internal Server Error
 *	/employees/{id}:
 *	  post:
 *	    summary: Update attributes of an employee given their employee ID 
 *	    tags: [Employees]
 *	  delete:
 *	    summary: Delete an employee from the database given their employee ID
 *	    tags: [Employees]
 */

router.get("/", employeesController.retrieveEmployees)

router.post("/role", employeesController.getRoleByEmail)

router.post("/:id", employeesController.updateEmployee)

router.post("/", employeesController.addEmployee)

router.delete("/:id", employeesController.deleteEmployee)

module.exports = router
// vim: tabstop=3
