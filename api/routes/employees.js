const express = require('express')
const router = express.Router()
const employeesController = require('../services/employees')

router.get("/", employeesController.retrieveEmployees)

module.exports = router
// vim: tabstop=3
