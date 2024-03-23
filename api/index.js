const express = require('express')
const app = express()
const PORT = 3000;

/*
	Use built-in JSON middleware so that incoming requests
	will have their bodies converted to JSON automatically.
*/

app.use(express.json())

// Define API endpoints

app.get("/", (req, res) => {
	res.status(200)
	res.send({"Message": "Hello World"})
})

app.listen(PORT, () => {
	console.log(`Listening on http://localhost:${PORT}`)
})
