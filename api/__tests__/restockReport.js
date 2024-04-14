const db = require('..//config/db');
const { generateRestockReport, fulfillRestock } = require('../services/reports/restockReport');

jest.mock('../config/db');

describe('generateRestockReport', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return inventory items with count less than mincount', async () => {
        const req = {}; // Mock request object
        const res = {
            status: jest.fn().mockReturnValue({ json: jest.fn() }), // Mock status method
        };

        const mockInventoryData = [{ id: 1, name: 'Item 1', count: 5, mincount: 10 }];
        const mockQueryCallback = jest.fn().mockImplementation((query, callback) => {
            callback(null, { rows: mockInventoryData });
        });

        db.query.mockImplementation(mockQueryCallback);

        await generateRestockReport(req, res);

        expect(mockQueryCallback).toHaveBeenCalledWith(
            'Select * FROM Inventory where count < mincount',
            expect.any(Function)
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.status().json).toHaveBeenCalledWith(mockInventoryData);
    });

    test('should throw an error if the database query fails', async () => {
        const req = {}; 
        const res = {}; 

        const mockQueryCallback = jest.fn().mockImplementation((query, callback) => {
            callback(new Error('Database error'));
        });

        db.query.mockImplementation(mockQueryCallback);

        try {
            await generateRestockReport(req, res);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('Database error');
        }

        expect(mockQueryCallback).toHaveBeenCalledWith(
            'Select * FROM Inventory where count < mincount',
            expect.any(Function)
        );
    });

    describe('fulfillRestock', () => {
        test('should update inventory count when count < mincount', async () => {
            const mockReq = {};
            const mockRes = {
                status: jest.fn(() => mockRes),
                json: jest.fn(),
            };
    
            const mockResult = { rowCount: 1 };
            db.query.mockImplementation((query, callback) => {
                callback(null, mockResult);
            });
    
            await fulfillRestock(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Inventory updated successfully for restock',
                affectedRows: 1 
            });
        });
    
        test('should handle database query error', async () => {
            const mockReq = {};
            const mockRes = {
                status: jest.fn(() => mockRes),
                json: jest.fn(),
            };
    
            const mockError = new Error('Database error');
            db.query.mockImplementation((query, callback) => {
                callback(mockError);
            });
    
            await fulfillRestock(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error updating inventory for restock' });
        });
    });

    
});
