const express = require('express')
const router = express.Router()
const transcationsController = require('../services/transactions')
// const salesReportController = require('../services/salesReport')

router.post("/new", transcationsController.createTransaction)

// router.get("/", (req, res) => {
// })

module.exports = router
// vim: tabstop=3
