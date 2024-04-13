const db = require('../config/db');
const { generateSalesReport } = require('../services/reports/salesReport'); 

jest.mock('../config/db');

describe('generateSalesReport', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should generate sales report for valid date range', async () => {
        const startDate = '2022-01-01';
        const endDate = '2022-01-31';

        const mockSalesData = [
            { itemName: 'Item 1', quantity_sold: 10, total_sales: 100 },
            { itemName: 'Item 2', quantity_sold: 15, total_sales: 150 },
        ];

        const mockQueryCallback = jest.fn().mockImplementation((query, params, callback) => {
            callback(null, { rows: mockSalesData });
        });

        db.query.mockImplementation(mockQueryCallback);

        const result = await generateSalesReport(startDate, endDate);

        expect(mockQueryCallback).toHaveBeenCalledWith(
            expect.stringContaining('SELECT'),
            [startDate, endDate],
            expect.any(Function)
        );
        expect(result).toEqual(mockSalesData);
    });

    test('should reject if start date is not before end date', async () => {
        const startDate = '2022-01-31';
        const endDate = '2022-01-01'; 

        try {
            await generateSalesReport(startDate, endDate);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('Start date must be before end date.');
        }

        expect(db.query).not.toHaveBeenCalled();
    });

    test('should handle database query error', async () => {
        const startDate = '2022-01-01';
        const endDate = '2022-01-31';

        const mockError = new Error('Database error');
        db.query.mockImplementation((query, params, callback) => {
            callback(mockError);
        });

        try {
            await generateSalesReport(startDate, endDate);
        } catch (error) {
            expect(error).toBe(mockError);
        }
    });
});
