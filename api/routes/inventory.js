const express = require('express')
const router = express.Router()
const inventoryItemsController = require('../services/inventory.js')

router.get("/", inventoryItemsController.retrieveInventoryItems)

router.patch("/updateQuantity", inventoryItemsController.updateInventItemQuant)

router.patch("/updatePrice", inventoryItemsController.updateInventItemPrice)

router.patch("/updateMinCount", inventoryItemsController.updateInventItemMin)

router.post("/", inventoryItemsController.addInventoryItem)

router.delete("/", inventoryItemsController.removeInventoryItem)

module.exports = router