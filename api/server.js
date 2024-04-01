const app = require('./index')
const db = require('./config/db')
const pg = require('pg').Pool

const PORT = 5001

app.listen(PORT, () => {
	console.log("server running")
})

