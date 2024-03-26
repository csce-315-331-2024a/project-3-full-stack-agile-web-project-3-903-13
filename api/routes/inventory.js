const express = require('express')
const router = express.Router()
const inventoryItemsController = require('../services/inventory.js')

router.get("/", inventoryItemsController.retrieveInventoryItems)

module.exports = router