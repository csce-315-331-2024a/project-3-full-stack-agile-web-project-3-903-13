const request = require('supertest')
const app = require('../index')
const db = require('../config/db');
jest.mock('../config/db');

let server;

beforeAll(done => {
  server = app.listen(5000, done);
});

afterAll(done => {
  server.close(done);
});

describe("Submit a clean transaction request", () => {
	test("The transaction service should serve correctly-structured transaction submissions", () => {
		const transaction = {
			"totalCost": 45.92,
			"taxAmount": 2.39,
			"orderContents": [
				{
						"id": 2,
						"quantity": 1
				}
			]
		}
		return request(app)
		.post("/api/transactions/new")
		.send(transaction)
		.then(response => {
			expect(response.statusCode).toBe(200)
		})
	})
})

describe("Submit a transaction request without totalCost", () => {
	test("The transaction service should reject requests not containing a total cost.", () => {
		const transaction = {
			"taxAmount": 2.39,
			"orderContents": [
				{
						"id": 2,
						"quantity": 1
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

describe("Submit a transaction request without taxAmount", () => {
	test("The transaction service should reject requests not containing a tax amount.", () => {
		const transaction = {
			"totalCost": 44.22,
			"orderContents": [
				{
						"id": 2,
						"quantity": 1
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