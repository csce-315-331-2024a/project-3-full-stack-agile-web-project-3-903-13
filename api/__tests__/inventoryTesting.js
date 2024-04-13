const db = require('../config/db');
const {
    getInventoryItems,
    addInventoryItem,
    removeInventoryItem,
    updateInventItemQuant,
    updateInventItemPrice,
    updateInventItemMin,
    getInventoryState,
    getInventoryUsage
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

        test('should return 500 if there is an error during the insert query', async () => {
            const mockReq = {
                body: { itemName: 'NewMilk', count: 10, price: 2.50, mincount: 5 }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
    
            db.query.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [], rowCount: 0 }));
    
            db.query.mockImplementationOnce((sql, params, callback) => callback(new Error('Insert query error')));
    
            await addInventoryItem(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).not.toHaveBeenCalledWith('Inventory item added successfully');
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

    describe('updateInventItemQuant', () => {
        const mockItemName = 'Milk';
        const mockNewCount = 20;
    
        test('should update item quantity successfully and return success message', async () => {
            const mockReq = {
                body: { itemName: mockItemName, newCount: mockNewCount }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
    
            db.query.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [mockItemName], rowCount: 1 }))
                       .mockImplementationOnce((sql, params, callback) => callback(null, { rowCount: 1 }));
    
            await updateInventItemQuant(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(202);
            expect(mockRes.send).toHaveBeenCalledWith(`Count of ${mockItemName} updated successfully`);
        });
    
        test('should return 401 if the item does not exist', async () => {
            const mockReq = {
                body: { itemName: mockItemName, newCount: mockNewCount }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
    
            db.query.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [], rowCount: 0 }));
    
            await updateInventItemQuant(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.send).toHaveBeenCalledWith("Item Doesn't exist");
        });
    
        test('should return 500 if there is an error in the select query', async () => {
            const mockReq = {
                body: { itemName: mockItemName, newCount: mockNewCount }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
    
            db.query.mockImplementationOnce((sql, params, callback) => callback(new Error('Query error')));
    
            await updateInventItemQuant(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(500);
        });
    
        test('should return 500 if there is an error in the update query', async () => {
            const mockReq = {
                body: { itemName: mockItemName, newCount: mockNewCount }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
    
            db.query.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [mockItemName], rowCount: 1 }))
                       .mockImplementationOnce((sql, params, callback) => callback(new Error('Update error')));
    
            await updateInventItemQuant(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(500);
        });
    });

    describe('updateInventItemPrice', () => {
        const mockItemName = 'Milk';
        const mockNewPrice = 3.50;
    
        test('should update item price successfully and return success message', async () => {
            const mockReq = {
                body: { itemName: mockItemName, newPrice: mockNewPrice }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
    
            db.query.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [mockItemName], rowCount: 1 }))
                       .mockImplementationOnce((sql, params, callback) => callback(null, { rowCount: 1 }));
    
            await updateInventItemPrice(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(202);
            expect(mockRes.send).toHaveBeenCalledWith(`Price of ${mockItemName} updated successfully`);
        });
    
        test('should return 401 if the item does not exist', async () => {
            const mockReq = {
                body: { itemName: mockItemName, newPrice: mockNewPrice }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
    
            db.query.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [], rowCount: 0 }));
    
            await updateInventItemPrice(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.send).toHaveBeenCalledWith("Item Doesn't exist");
        });
    
        test('should return 500 if there is an error in the select query', async () => {
            const mockReq = {
                body: { itemName: mockItemName, newPrice: mockNewPrice }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
    
            db.query.mockImplementationOnce((sql, params, callback) => callback(new Error('Select query error')));
    
            await updateInventItemPrice(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(500);
        });
    
        test('should return 500 if there is an error in the update query', async () => {
            const mockReq = {
                body: { itemName: mockItemName, newPrice: mockNewPrice }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
    
            db.query.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [mockItemName], rowCount: 1 }))
                       .mockImplementationOnce((sql, params, callback) => callback(new Error('Update query error')));
    
            await updateInventItemPrice(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(500);
        });
    });

    describe('updateInventItemMin', () => {
        const mockItemName = 'Milk';
        const mockNewMinCount = 5;
    
        test('should update item mincount successfully and return success message', async () => {
            const mockReq = {
                body: { itemName: mockItemName, newCount: mockNewMinCount }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
    
            db.query.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [mockItemName], rowCount: 1 }))
                       .mockImplementationOnce((sql, params, callback) => callback(null, { rowCount: 1 }));
    
            await updateInventItemMin(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(202);
            expect(mockRes.send).toHaveBeenCalledWith(`MinCount of ${mockItemName} updated successfully`);
        });
    
        test('should return 401 if the item does not exist', async () => {
            const mockReq = {
                body: { itemName: mockItemName, newCount: mockNewMinCount }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
    
            db.query.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [], rowCount: 0 }));
    
            await updateInventItemMin(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.send).toHaveBeenCalledWith("Item Doesn't exist");
        });
    
        test('should return 500 if there is an error in the select query', async () => {
            const mockReq = {
                body: { itemName: mockItemName, newCount: mockNewMinCount }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
    
            db.query.mockImplementationOnce((sql, params, callback) => callback(new Error('Select query error')));
    
            await updateInventItemMin(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(500);
        });
    
        test('should return 500 if there is an error in the update query', async () => {
            const mockReq = {
                body: { itemName: mockItemName, newCount: mockNewMinCount }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
    
            db.query.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [mockItemName], rowCount: 1 }))
                       .mockImplementationOnce((sql, params, callback) => callback(new Error('Update query error')));
    
            await updateInventItemMin(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getInventoryState', () => {
        const mockStartDate = '2021-01-01';
    
        test('should return inventory state successfully', async () => {
            const mockReq = {
                query: { startDate: mockStartDate }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockInventoryState = [
                { name: 'Milk', InventoryBegin: 100 },
                { name: 'Eggs', InventoryBegin: 200 }
            ];
    
            db.query.mockImplementation((sql, params, callback) => callback(null, { rows: mockInventoryState }));
    
            await getInventoryState(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockInventoryState);
        });
    
        test('should throw an error if the database query fails', async () => {
            const mockReq = {
                query: { startDate: mockStartDate }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn()
            };
    
            db.query.mockImplementation((sql, params, callback) => callback(new Error('Query error')));
    
            await expect(async () => {
                await getInventoryState(mockReq, mockRes);
            }).rejects.toThrow('Query error');
        });
    });

    describe('getInventoryUsage', () => {
        test('should reject with an error if the database query fails', async () => {
            const startDate = '2023-01-01';
            const endDate = '2023-01-31';
            db.query.mockImplementation((sql, params, callback) => {
                callback(new Error('Database query error'), null);
            });
    
            await expect(getInventoryUsage(startDate, endDate))
                .rejects
                .toThrow('Database query error');
    
            expect(db.query).toHaveBeenCalledWith(expect.any(String), [startDate, endDate], expect.any(Function));
        });
    });
});