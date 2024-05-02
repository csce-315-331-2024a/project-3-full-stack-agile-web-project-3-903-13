const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const employeesRouter = require('../routes/employees');

const app = express();
app.use(bodyParser.json());
app.use('/api/employees', employeesRouter);

describe("Employees API", () => {
    test("GET /api/employees should retrieve all employees", async () => {
        const response = await request(app).get("/api/employees");
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test("POST /api/employees should add a new employee", async () => {
        const newEmployee = {
            name: "John Doe",
            age: 30,
            phone: "123-456-7890",
            hours: 40,
            role: "Manager"
        };
        const response = await request(app)
            .post("/api/employees")
            .send(newEmployee);
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("Employee added successfully");
    });

    test("POST /api/employees/:id should update an employee", async () => {
        const updatedInfo = {
            id: 1,
            age: 31,
            phone: "123-456-7891",
            hours: 41,
            role: "Senior Manager"
        };
        const response = await request(app)
            .post(`/api/employees/${updatedInfo.id}`)
            .send(updatedInfo);
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("Successfuly updated user");
    });

    test("DELETE /api/employees/:id should delete an employee", async () => {
        const employeeId = 1;
        const response = await request(app).delete(`/api/employees/${employeeId}`);
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("Succesfully deleted user");
    });

    test("POST /api/employees should handle errors", async () => {
        const invalidEmployee = { name: "Jane Doe" };
        const response = await request(app)
            .post("/api/employees")
            .send(invalidEmployee);
        expect(response.statusCode).toBe(500);
        expect(response.text).toBe("Could not add employee");
    });
});


module.exports = app;