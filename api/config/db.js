const Pool = require('pg').Pool

const db = new Pool({
	user: process.env.user,
	host: process.env.host,
	database: process.env.db,
	password: process.env.password,
	port: process.env.port,
})

module.exports = db


// vim: tabstop=3
