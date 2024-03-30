const express = require('express')
const router = express.Router()
const menuItemsController = require('../services/menuitems')

router.get("/", menuItemsController.retrieveMenuItems)
router.patch('/', menuItemsController.updateMenuItem);
router.post('/', menuItemsController.addMenuItem);

module.exports = router
// vim: tabstop=3
