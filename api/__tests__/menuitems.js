const request = require('supertest')
const app = require('../index')

let server;

beforeAll(done => {
  server = app.listen(5000, done);
});

afterAll(done => {
  server.close(done);
});

describe("Retrieve all menu items", () => {
	test("The menu items service should correctly retrieve all menu items from the database table menuitems", () => {
		
		return request(app)
		.get("/api/menuitems")
		.then(response => {
			expect(response.statusCode).toBe(200)
		})
	})
})

describe("Retrieve ingredients for a menu item", () => {
	test("The menu items service should retrieve all inventory items associated with a menu item", () => {
		return request(app)
            .get("/api/menuItems/getIngreds") // Making a request to the specific route
            .query({ itemName: "Cheeseburger" }) // Adding the query parameter
            .expect(200); // Asserting the response status
	});
});



describe("Add a duplicate menu item", () => {
	test("The menu items service should reject this as the item already exists.", () => {
		const item = {
			"itemName": "Cheeseburger",
			"price": 1,
			  "category":0,
			  "ingredients":
			  [
				  {
							  
				  }
			  ],
			  "isSeasonal":false,
			  "expirationDate": "2024-02-02"
		  }
		  
		return request(app)
		.post("/api/menuitems")
		.send(item)
		.then(response => {
			expect(response.statusCode).toBe(401)
		})
	})
})


describe("Add a menu item", () => {
	test("The menu items service should add a new menu item to the menu items table.", () => {
		const item = {
			"itemName": "Test",
			"price": 1,
			  "category":0,
			  "ingredients":
			  [
				  {
							  
				  }
			  ],
			  "isSeasonal":false,
			  "expirationDate": "2024-02-02"
		  }
		  
		return request(app)
		.post("/api/menuitems")
		.send(item)
		.then(response => {
			expect(response.statusCode).toBe(201)
		})
	})
})

describe("Add a seasonal item", () => {
	test("The menu items service should add a new seasonal item to the menu items table.", () => {
		const item = {
			"itemName": "Test2",
			"price": 1,
			  "category":0,
			  "ingredients":
			  [
				  {
							  
				  }
			  ],
			  "isSeasonal":true,
			  "expirationDate": "2024-02-02"
		  }
		  
		return request(app)
		.post("/api/menuitems")
		.send(item)
		.then(response => {
			expect(response.statusCode).toBe(201)
		})
	})
})

describe("Update a menu item's category", () => {
	test("The menu items service should update the menu items category", () => {
		const item = {
			"itemName":"Test",
			"newCat": 1
		}
		  
		return request(app)
		.patch("/api/menuitems/updateCat")
		.send(item)
		.then(response => {
			expect(response.statusCode).toBe(202)
		})
	})
})

describe("Update a menu item's price", () => {
	test("The menu items service should update the menu items price", () => {
		const item = {
			"itemName":"Test",
			"newPrice": 2
		}
		  
		return request(app)
		.patch("/api/menuitems/updatePrice")
		.send(item)
		.then(response => {
			expect(response.statusCode).toBe(202)
		})
	})
})

describe("Update a menu item's ingredients", () => {
	test("The menu items service should update the menu items ingredients", () => {
		const item = {
			"itemName":"Test",
			"ingredients": [
				{
					"inventID": 1,
					"quantity": 1
				}
			]
		}
		  
		return request(app)
		.patch("/api/menuitems/updateIngred")
		.send(item)
		.then(response => {
			expect(response.statusCode).toBe(202)
		})
	})
})

describe("Delete a menu item", () => {
	test("The menu items service should delete the menu item from the database", () => {
		const item = {
			"itemName":"Test"
		}
		  
		return request(app)
		.delete("/api/menuitems")
		.send(item)
		.then(response => {
			expect(response.statusCode).toBe(200)
		})
	})
})

describe("Delete a seasonal item", () => {
	test("The menu items service should delete the seasonal item from the database", () => {
		const item = {
			"itemName":"Test2"
		}
		  
		return request(app)
		.delete("/api/menuitems")
		.send(item)
		.then(response => {
			expect(response.statusCode).toBe(200)
		})
	})
})

describe("Delete a menu item that doesnt exist", () => {
	test("The menu items service should not delete the menu item as it doesnt exist", () => {
		const item = {
			"itemName":"RANDOM"
		}
		  
		return request(app)
		.delete("/api/menuitems")
		.send(item)
		.then(response => {
			expect(response.statusCode).toBe(404)
		})
	})
})

/*
describe("Submit a transaction request without order contents.", () => {
	test("The transaction service should reject requests not containing an order.", () => {
		const transaction = {
			"totalCost": 44.22,
			"taxAmount": 2.22,
		}
		return request(app)
		.post("/api/transactions/new")
		.send(transaction)
		.then(response => {
			expect(response.statusCode).toBe(400)
		})
	})
})

describe("Submit transaction request with improper formatting of order contents.", () => {
	test("The transaction service should not serve requests with improperly-formatted order contents.", () => {
		const transaction = {
			"totalCost": 45.92,
			"taxAmount": 2.39,
			"orderContents": [
				{
					"id": 2,
					"quantity": 1
				},
				{
					"ghda;": 2, // doesn't have id attribute -> should trigger error
					"quantity": 3
				}
			]
		}
		return request(app)
		.post("/api/transactions/new")
		.send(transaction)
		.then(response => {
			expect(response.statusCode).toBe(400)
		})
	})
})
*/