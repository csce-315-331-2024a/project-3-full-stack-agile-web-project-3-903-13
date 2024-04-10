const db = require('../config/db');
const {
    getInventoryItems,
    addInventoryItem,
    removeInventoryItem,
    //NEED TO ADD MORE FUCNTIONS
} = require('../services/inventory');

jest.mock('../config/db');

describe('Inventory Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getInventoryItems', () => {
        test('should return all inventory items on success', async () => {
            const mockItems = [{ id: 1, itemName: 'Milk', count: 10, price: 2.5, mincount: 5 }];
            db.query.mockImplementation((queryText, callback) => callback(null, { rows: mockItems }));

            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getInventoryItems(null, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockItems);
        });

        test('should return 400 if database query fails', async () => {
            db.query.mockImplementation((queryText, callback) => callback(new Error("Query Failed")));

            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            await getInventoryItems(null, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.send).toHaveBeenCalledWith("Query Failed");
        });
    });

    describe('addInventoryItem', () => {
        test('should add a new inventory item and return success message', async () => {
            const mockReq = {
                body: { itemName: 'Butter', count: 10, price: 3.5, mincount: 2 }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            db.query.mockImplementationOnce((queryText, values, callback) => callback(null, { rows: [] }))
                       .mockImplementationOnce((queryText, values, callback) => callback(null, { rowCount: 1 })); 

            await addInventoryItem(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.send).toHaveBeenCalledWith('Inventory item added successfully');
        });

        test('should not add an item if it already exists and return an error message', async () => {
            const mockReq = {
                body: { itemName: 'Butter', count: 10, price: 3.5, mincount: 2 }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            db.query.mockImplementationOnce((queryText, values, callback) => callback(null, { rows: [mockReq.body] }));

            await addInventoryItem(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.send).toHaveBeenCalledWith('Item Already exists');
        });

        test('should return 500 if database query fails', async () => {
            const mockReq = {
                body: { itemName: 'Butter', count: 10, price: 3.5, mincount: 2 }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            db.query.mockImplementation((queryText, values, callback) => callback(new Error("Query Failed")));

            await addInventoryItem(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(500);
        });
    });

    describe('removeInventoryItem', () => {
        test('should remove the inventory item and return success message', async () => {
            const mockReq = {
                body: { itemName: 'Butter' }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            db.query.mockImplementation((queryText, values, callback) => callback(null, { rowCount: 1 })); 

            await removeInventoryItem(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith(`Inventory item with name ${mockReq.body.itemName} removed successfully`);
        });

        test('should return 404 if the item does not exist', async () => {
            const mockReq = {
                body: { itemName: 'Butter' }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            db.query.mockImplementation((queryText, values, callback) => callback(null, { rowCount: 0 }));

            await removeInventoryItem(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.send).toHaveBeenCalledWith('Inventory item not found');
        });

        test('should return 500 if database query fails', async () => {
            const mockReq = {
                body: { itemName: 'Butter' }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            db.query.mockImplementation((queryText, values, callback) => callback(new Error("Internal Server Error")));

            await removeInventoryItem(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith('Internal Server Error');
        });
    });

});