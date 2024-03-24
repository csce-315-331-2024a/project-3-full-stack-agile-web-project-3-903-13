const express = require('express')
const router = express.Router()
const menuItemsController = require('../services/menuitems')

router.get("/", menuItemsController.retrieveMenuItems)
const bodyParser = require('body-parser');
router.use(bodyParser.json());

// Route for adding a new menu item
router.post('/', menuItemsController.addMenuItem);
module.exports = router
