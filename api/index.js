const express = require('express')
const cors = require('cors')
const app = express()
const PORT = 5000;

const db = require('./config/db')
db.connect()

/*
 * Make this query right when the server starts as it seems
 * the first query is slow, and subsequent queries run in reasonable time.
 * If there's a better way to do this, we should try to find it.
 * */
db.query("SELECT * FROM employees")

/*
	Use built-in JSON middleware so that incoming requests
	will have their bodies converted to JSON automatically.
*/

app.use(cors())
app.use(express.json())


const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API for Rev's Grill",
    description:
      "This is a REST API application made with Express. It retrieves data from the Rev's Grill Database.",
    contact: {
      name: "Rev's Grill",
      url: 'https://project-3-full-stack-agile-web-project-3-903-13-six.vercel.app/',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Development server',
    },
    {
      url: 'https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/',
      description: 'Production server',
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js'],
};

const swaggerJSDoc = require('swagger-jsdoc')
const swaggerSpec = swaggerJSDoc(options)
const swaggerUi = require('swagger-ui-express');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Handle requests with the express router
const menuItemsRouter = require('./routes/menuItems')
const transactionsRouter = require('./routes/transactions')
const ingredientsRouter = require('./routes/ingredients')
const inventoryRouter = require('./routes/inventory')
const foodItemsRouter = require('./routes/foodItems')
const employeesRouter = require('./routes/employees')
const reportsRouter = require('./routes/reports')


app.use("/api/menuitems", menuItemsRouter)
app.use("/api/transactions", transactionsRouter)
app.use("/api/ingredients", ingredientsRouter)
app.use("/api/inventory", inventoryRouter)
app.use("/api/fooditems", foodItemsRouter)
app.use("/api/employees", employeesRouter)
app.use("/api/reports", reportsRouter)


function startServer() {
    const server = app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}.`);
    });
    return server;
}

if (require.main === module) {
    startServer();
}


module.exports = app;
module.exports.startServer = startServer;

// vim: tabstop=3
