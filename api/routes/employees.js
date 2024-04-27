const express = require('express')
const router = express.Router()
const employeesController = require('../services/employees')

router.get("/", employeesController.retrieveEmployees)

router.get("/role", employeesController.getRoleByEmail)

router.post("/:id", employeesController.updateEmployee)

router.post("/", employeesController.addEmployee)

router.delete("/:id", employeesController.deleteEmployee)

module.exports = router
// vim: tabstop=3
