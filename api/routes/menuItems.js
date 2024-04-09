const express = require('express')
const router = express.Router()
const menuItemsController = require('../services/menuitems')

// CREATE a NEW Menu Item
router.post("/", menuItemsController.addMenuItem);

// READ existing menuItems and ingredients
router.get("/", menuItemsController.retrieveMenuItems);
router.get("/getIngreds", menuItemsController.retrieveMenuItemIngredients);

// UPDATE various attributes
router.patch("/updatePrice", menuItemsController.updateMenuItemPrice);
router.patch("/updateCat", menuItemsController.updateMenuItemCat);
router.patch("/updateIngred", menuItemsController.updateMenuItemIngred);

// DELETE a menu item
router.delete("/", menuItemsController.removeMenuItem);


module.exports = router
// vim: tabstop=3
