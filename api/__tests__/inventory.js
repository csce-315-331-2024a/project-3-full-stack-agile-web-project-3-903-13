const request = require('supertest')
const app = require('../index')

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