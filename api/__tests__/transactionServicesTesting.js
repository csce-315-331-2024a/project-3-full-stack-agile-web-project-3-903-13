const db = require('../config/db');
const {
    updateFoodItemsTable,
    insertTransaction,
    decrementInventory,
    createTransaction
} = require('../services/transactions'); 

jest.mock('../config/db');

describe('Transactions Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('updateFoodItemsTable', () => {
        test('should successfully insert food items into the table', async () => {
            const transactionId = 1;
            const orderContents = [{ id: 2, quantity: 3 }];
            
            db.query.mockImplementation(() => Promise.resolve());

            await updateFoodItemsTable(transactionId, orderContents);

            // Check if db.query was called for each item in orderContents
            expect(db.query).toHaveBeenCalledTimes(orderContents.length);
            orderContents.forEach(item => {
                expect(db.query).toHaveBeenCalledWith(
                    "INSERT INTO fooditems VALUES (DEFAULT, $1, $2, $3)",
                    [transactionId, item.id, item.quantity]
                );
            });
        });

        test('should throw an error if the database query fails', async () => {
            const transactionId = 1;
            const orderContents = [{ id: 2, quantity: 3 }];
            
            db.query.mockImplementation(() => Promise.reject(new Error('Database error')));

            await expect(updateFoodItemsTable(transactionId, orderContents))
                .rejects
                .toThrow('Database error');

            expect(db.query).toHaveBeenCalledWith(
                "INSERT INTO fooditems VALUES (DEFAULT, $1, $2, $3)",
                [transactionId, orderContents[0].id, orderContents[0].quantity]
            );
        });
    });

    describe('insertTransaction', () => {
        const totalCost = 100;
        const taxAmount = 20;
    
        test('should insert a transaction and return its ID on success', async () => {
            const mockTransactionId = 1;
            db.query.mockResolvedValue({ rows: [{ transactionid: mockTransactionId }] });
    
            const result = await insertTransaction(totalCost, taxAmount);
    
            expect(result).toBe(mockTransactionId);
            expect(db.query).toHaveBeenCalledWith(
                "INSERT INTO transactions values (DEFAULT, $1::timestamp, $2, $3) RETURNING transactionid",
                [expect.any(String), totalCost, taxAmount]
            );
        });
    
        test('should log an error and return undefined if the database query fails', async () => {
            const consoleSpy = jest.spyOn(console, 'log');
            db.query.mockRejectedValue(new Error('Database error'));
    
            const result = await insertTransaction(totalCost, taxAmount);
    
            expect(result).toBeUndefined();
            expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
            consoleSpy.mockRestore();
        });
    });

    describe('decrementInventory', () => {
        test('should log an error if the database query fails', async () => {
            const orderContents = [{ id: 1, quantity: 2 }];
            
            // Simulate a failure in the SELECT query to trigger the catch block
            db.query.mockRejectedValueOnce(new Error('Database error'));
    
            const consoleSpy = jest.spyOn(console, 'log');
    
            await decrementInventory(orderContents);
            await Promise.resolve();
    
            expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
            consoleSpy.mockRestore();
        });

        test('should decrement inventory based on order contents', async () => {
            const orderContents = [{ id: 1, quantity: 2 }];
    
            const mockSelectResults = { rows: [{ inventid: 1, quantity: 5 }] };
            db.query.mockResolvedValueOnce(mockSelectResults);
    
            db.query.mockResolvedValueOnce({}); // Mock successful UPDATE query
    
            const consoleSpy = jest.spyOn(console, 'log');
    
            await decrementInventory(orderContents);
            await Promise.resolve(); 

            expect(db.query).toHaveBeenCalledWith("SELECT inventid, quantity FROM ingredients WHERE menuid = $1", [1]);
            expect(db.query).toHaveBeenCalledWith("UPDATE inventory SET count = count - $1 WHERE inventid = $2", [10, 1]);
            expect(consoleSpy).not.toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });
});
