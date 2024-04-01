const express = require('express')
const router = express.Router()
const menuItemsController = require('../services/menuitems')

router.get("/", menuItemsController.retrieveMenuItems);

router.get("/getIngreds", menuItemsController.retrieveMenuItemIngredients);

router.patch("/updatePrice", menuItemsController.updateMenuItemPrice);

router.patch("/updateCat", menuItemsController.updateMenuItemCat);

router.patch("/updateIngred", menuItemsController.updateMenuItemIngred);

router.delete("/", menuItemsController.removeMenuItem);

router.post("/", menuItemsController.addMenuItem);

module.exports = router
// vim: tabstop=3
