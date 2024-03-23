const express = require('express')
const router = express.Router()
const menuItemsController = require('../services/menuitems')

router.get("/", menuItemsController.retrieveMenuItems)

module.exports = router
