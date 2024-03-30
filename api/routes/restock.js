const express = require('express')
const router = express.Router()
const Restock = require("../services/restockreport")


router.get("/", Restock.getRestockReport);

router.patch("/",Restock.fulfillRestock);

module.exports = router
// vim: tabstop=3
