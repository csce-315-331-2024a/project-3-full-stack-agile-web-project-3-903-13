const request = require('supertest');
const express = require('express');
const foodItemsRouter = require('../routes/foodItems');
const ingredientsRouter = require('../routes/ingredients');
const employeesRouter = require('../routes/employees');
const inventoryRouter = require('../routes/inventory'); 
const reportsRouter = require('../routes/reports'); 
const transactionsRouter = require('../routes/transactions');

const app = express();
app.use(express.json());
app.use('/api/fooditems', foodItemsRouter);
app.use('/api/ingredients', ingredientsRouter);
app.use('/api/employees', employeesRouter);
app.use('/api/inventory', inventoryRouter); 
app.use('/api/reports', reportsRouter);
app.use('/api/transactions', transactionsRouter);

describe("API Routes", () => {
    test("GET /api/fooditems should respond with 'hello food items'", async () => {
        const response = await request(app).get("/api/fooditems");
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("hello food items");
    });

    test("GET /api/ingredients should respond with 'hello ingredients'", async () => {
        const response = await request(app).get("/api/ingredients");
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("hello ingredients");
    });

    // Inventory usage report tests
    describe("Inventory usage report", () => {
        test("GET /api/inventory/usage with both start and end dates should respond with usage report data", async () => {
            const startDate = '2023-01-01';
            const endDate = '2023-01-31';
            const response = await request(app)
                .get(`/api/inventory/usage?startDate=${startDate}&endDate=${endDate}`);
            
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeDefined();
        });

        test("GET /api/inventory/usage without start date should respond with error", async () => {
            const endDate = '2023-01-31';
            const response = await request(app)
                .get(`/api/inventory/usage?endDate=${endDate}`);
            
            expect(response.statusCode).toBe(400);
            expect(response.text).toBe("Please provide both start and end dates.");
        });

        test("GET /api/inventory/usage with invalid date range should respond with server error", async () => {
            const startDate = 'invalid-date';
            const endDate = 'invalid-date';
            const response = await request(app)
                .get(`/api/inventory/usage?startDate=${startDate}&endDate=${endDate}`);
            
            expect(response.statusCode).toBe(500);
            expect(response.text).toBe('Error retrieving inventory usage data');
        });
    });

    describe("Sales Report", () => {
        test("GET /api/reports/salesReport with both start and end dates should respond with sales report data", async () => {
            const startDate = '2023-01-01';
            const endDate = '2023-01-31';
            const response = await request(app)
                .get(`/api/reports/salesReport?startDate=${startDate}&endDate=${endDate}`);
            
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeDefined(); 
        });

        test("GET /api/reports/salesReport without start or end date should respond with error", async () => {
            const response = await request(app).get(`/api/reports/salesReport`);
            
            expect(response.statusCode).toBe(400);
            expect(response.text).toBe("Please provide both start and end dates.");
        });
    });

    describe("Transactions API", () => {
        describe("POST /api/transactions/getTransactionByID", () => {
            test("should respond with transaction data for valid transaction ID", async () => {
                const transactionID = '123';
                const response = await request(app)
                    .post("/api/transactions/getTransactionByID")
                    .send({ transactionID: transactionID });
            
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeDefined();
                expect(response.body).toMatchObject({
                    transactionid: transactionID,
                    components: expect.arrayContaining([
                        expect.objectContaining({
                            itemname: expect.any(String),
                            price: expect.any(Number),
                            quantity: expect.any(Number),
                        })
                    ]),
                    cost: expect.any(Number),
                    status: expect.any(String),
                    transactiontime: expect.any(String)
                });
            });
    
            test("should respond with error for invalid or deleted transaction ID", async () => {
                const transactionID = 'invalid';
                const response = await request(app)
                    .post("/api/transactions/getTransactionByID")
                    .send({ transactionID: transactionID });
    
                expect(response.statusCode).toBe(500);
                expect(response.text).toBe('Error retrieving transaction. ID may be invalid or deleted. Kindly check the ID');
            });
        });
    });
});