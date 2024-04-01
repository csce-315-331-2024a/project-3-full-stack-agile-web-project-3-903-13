const express = require('express')
const router = express.Router()
const transactionsController = require('../services/reports/whatSellsTogether')

router.post("/whatSellsTogether", transactionsController.generateReport)

module.exports = router
// vim: tabstop=3
