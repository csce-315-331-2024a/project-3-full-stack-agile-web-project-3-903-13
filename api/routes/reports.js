const express = require('express')
const router = express.Router()

router.get("/", (req, res) => {
    res.send("Boo yeah. Want some reports? you at the right place y'all")
})

module.exports = router