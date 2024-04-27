const db = require('../config/db');
const {
    updateFoodItemsTable,
    insertTransaction,
    decrementInventory,
    createTransaction,
    incrementInventory,
    verifyOrderFormatting,
    deleteTransaction,
    updateTransaction,
    getTransactionInfo,
    getTransactionsByPeriod,
    getInProgressOrders,
    fullfillOrder
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

            expect(db.query).toHaveBeenCalledTimes(orderContents.length);
            orderContents.forEach(item => {
                expect(db.query).toHaveBeenCalledWith(
                    "INSERT INTO fooditems VALUES (DEFAULT, $1, $2, $3, $4)",
                    [transactionId, item.id, item.quantity]
                );
            });
        });
    });

    describe('insertTransaction', () => {
        const totalCost = 100;
        const taxAmount = 20;
    
        test('should insert a transaction and return its ID on success', async () => {
            const mockTransactionId = 1;
            db.query.mockResolvedValue({ rows: [{ transactionid: mockTransactionId }] });
        
            const totalCost = 100;
            const taxAmount = 20;
        
            const result = await insertTransaction(totalCost, taxAmount);
        
            expect(result).toBe(mockTransactionId);
            expect(db.query).toHaveBeenCalledWith(
                "INSERT INTO transactions values (DEFAULT, $1::timestamp, $2, $3, 'in progress') RETURNING transactionid",
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
    
            db.query.mockResolvedValueOnce({});
    
            const consoleSpy = jest.spyOn(console, 'log');
    
            await decrementInventory(orderContents);
            await Promise.resolve(); 

            expect(db.query).toHaveBeenCalledWith("SELECT inventid, quantity FROM ingredients WHERE menuid = $1", [1]);
            expect(db.query).toHaveBeenCalledWith("UPDATE inventory SET count = count - $1 WHERE inventid = $2", [10, 1]);
            expect(consoleSpy).not.toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe('incrementInventory', () => {
        const components = [
            { id: 1, quantity: 3 },
            { id: 2, quantity: 2 }
        ];
    
        beforeEach(() => {
            jest.clearAllMocks();
        });
    
        test('should log an error if any database query fails', async () => {
            const consoleSpy = jest.spyOn(console, 'log');
            db.query.mockRejectedValue(new Error('Database error'));
    
            await incrementInventory(components);
    
            expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
            consoleSpy.mockRestore();
        });
    }); 

    describe('verifyOrderFormatting', () => {
        test('should return true when all elements are correctly formatted', () => {
            const orderContents = [
                { id: 1, quantity: 5 },
                { id: 2, quantity: 3 }
            ];
            expect(verifyOrderFormatting(orderContents)).toBe(true);
        });
    
        test('should return false if any element is missing an id', () => {
            const orderContents = [
                { quantity: 5 },
                { id: 2, quantity: 3 }
            ];
            expect(verifyOrderFormatting(orderContents)).toBe(false);
        });
    
        test('should return false if any element is missing a quantity', () => {
            const orderContents = [
                { id: 1 },
                { id: 2, quantity: 3 }
            ];
            expect(verifyOrderFormatting(orderContents)).toBe(false);
        });
    
        test('should return true for an empty array', () => {
            const orderContents = [];
            expect(verifyOrderFormatting(orderContents)).toBe(true);
        });
    });

    describe('deleteTransaction', () => {
        let mockRequest, mockResponse;
        beforeEach(() => {
            jest.clearAllMocks();
            mockRequest = {
                body: {
                    transactionID: 123,
                    components: [{ id: 1, quantity: 5 }]
                }
            };
            mockResponse = {
                status: jest.fn(() => mockResponse),
                send: jest.fn()
            };
        });
    
        test('should log error and not send response if database error occurs', async () => {
            db.query.mockRejectedValue(new Error('Database error'));
            
            const consoleSpy = jest.spyOn(console, 'log');
            await deleteTransaction(mockRequest, mockResponse);
            expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
            expect(mockResponse.send).not.toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    
        test('should handle partial failures where transaction deletion fails after food items deletion', async () => {
            db.query.mockResolvedValueOnce({});
            db.query.mockRejectedValue(new Error('Database error'));
    
            const consoleSpy = jest.spyOn(console, 'log');
            await deleteTransaction(mockRequest, mockResponse);
            expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
            expect(mockResponse.send).not.toHaveBeenCalled();
            expect(db.query).toHaveBeenCalledWith(`DELETE FROM transactions WHERE transactionID = ${mockRequest.body.transactionID}`);
            consoleSpy.mockRestore();
        });
    });

    describe('deleteTransaction2', () => {
        let mockRequest, mockResponse;
        beforeEach(() => {
            jest.clearAllMocks();
            mockRequest = {
                body: {
                    transactionID: 123,
                    components: [{ id: 1, quantity: 5 }]
                }
            };
            mockResponse = {
                status: jest.fn(() => mockResponse),
                send: jest.fn()
            };
        });
    
        test('should send a 200 status and a success message upon successful deletion', async () => {
            db.query.mockResolvedValueOnce({});
            db.query.mockResolvedValueOnce({});
    
            const incrementSpy = jest.spyOn(require('../services/transactions'), 'incrementInventory');
            incrementSpy.mockResolvedValueOnce({});
    
            await deleteTransaction(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.send).toHaveBeenCalledWith("Transaction Deleted");
        });

        test('should handle errors gracefully', async () => {
            db.query.mockRejectedValueOnce(new Error('Database error')); 
    
            await deleteTransaction(mockRequest, mockResponse);
            expect(mockResponse.send).not.toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalledWith(200);
        });
    });

    describe('updateTransaction', () => {
        let mockRequest, mockResponse;
        beforeEach(() => {
            jest.clearAllMocks();
            jest.spyOn(console, 'log').mockImplementation(() => {});
            mockRequest = {
                body: {
                    transactionID: 1,
                    oldcomponents: [{ id: 1, quantity: 2, price: 10 }],
                    newComponents: [{ id: 2, quantity: 3, price: 20 }]
                }
            };
            mockResponse = {
                status: jest.fn(() => mockResponse),
                send: jest.fn(),
                json: jest.fn()
            };
        });
    
        test('should handle database errors gracefully', async () => {
            db.query.mockRejectedValueOnce(new Error('Database error'));
    
            await updateTransaction(mockRequest, mockResponse);
    
            expect(console.log).toHaveBeenCalledWith(expect.any(Error));
            expect(mockResponse.send).not.toHaveBeenCalled();
        });
    
        test('should calculate total cost and tax correctly', async () => {
            const { newComponents } = mockRequest.body;
            const subCost = newComponents.reduce((total, item) => total + item.price * item.quantity, 0);
            const taxAmount = subCost * 0.0825;
            const finalAmount = subCost + taxAmount;
    
            db.query.mockResolvedValueOnce({});
            db.query.mockResolvedValueOnce({}); 
    
            jest.spyOn(require('../services/transactions'), 'incrementInventory').mockResolvedValueOnce({});
            jest.spyOn(require('../services/transactions'), 'updateFoodItemsTable').mockResolvedValueOnce({});
            jest.spyOn(require('../services/transactions'), 'decrementInventory').mockResolvedValueOnce({});
    
            await updateTransaction(mockRequest, mockResponse);
    
            const updateCall = db.query.mock.calls.find(call => call[0].includes('UPDATE transactions SET'));
            expect(updateCall[0]).toContain(`totalcost = ${finalAmount}`);
            expect(updateCall[0]).toContain(`tax = ${taxAmount}`);
        });
    });

    describe('getTransactionInfo', () => {
        const transactionId = 1;
        const mockTransactionInfo = {
            transactiontime: '2022-01-01 12:00:00',
            totalcost: 100,
            status: 'completed'
        };
        const mockFoodItems = [
            { ID: 1, itemname: 'Burger', price: 10, Quantity: 2 },
            { ID: 2, itemname: 'Fries', price: 5, Quantity: 3 }
        ];
    
        beforeEach(() => {
            jest.clearAllMocks();
        });
    
        test('should return transaction information and associated food items successfully', async () => {
            db.query
                .mockResolvedValueOnce({ rows: [mockTransactionInfo] }) 
                .mockResolvedValueOnce({ rows: mockFoodItems });      
        
            const result = await getTransactionInfo(transactionId);
        
            expect(result).toEqual({
                transactiontime: mockTransactionInfo.transactiontime,
                cost: mockTransactionInfo.totalcost,
                status: mockTransactionInfo.status,
                transactionid: transactionId,
                components: mockFoodItems
            });
            expect(db.query).toHaveBeenCalledTimes(2);
            expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT transactiontime, totalcost, status FROM transactions WHERE transactionid ='));
            expect(db.query).toHaveBeenCalledWith(expect.stringMatching(/FROM fooditems\s+INNER JOIN menuitems\s+ON menuitems\.menuid = fooditems\.menuid\s+WHERE fooditems\.transactionid = \d+\s+ORDER BY itemname;/));
        });
    
        test('should handle errors if the database query fails', async () => {
            db.query.mockRejectedValue(new Error('Database error'));
    
            await expect(getTransactionInfo(transactionId)).rejects.toThrow('Database error');
            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT transactiontime, totalcost, status FROM transactions WHERE transactionid ='));
        });
    });

    describe('getTransactionsByPeriod', () => {
        let mockRequest, mockResponse;
        beforeEach(() => {
            jest.clearAllMocks();
            mockRequest = {
                body: {
                    startDate: '2022-01-01',
                    endDate: '2022-01-31'
                }
            };
            mockResponse = {
                status: jest.fn(() => mockResponse),
                json: jest.fn()
            };
        });
    
        test('should handle errors if the database query fails', async () => {
            const errorMessage = 'Database error';
            db.query.mockRejectedValueOnce(new Error(errorMessage));
    
            await expect(getTransactionsByPeriod(mockRequest, mockResponse)).rejects.toThrow(errorMessage);
    
            expect(db.query).toHaveBeenCalled();
            expect(mockResponse.json).not.toHaveBeenCalled();
        });
    });
});
