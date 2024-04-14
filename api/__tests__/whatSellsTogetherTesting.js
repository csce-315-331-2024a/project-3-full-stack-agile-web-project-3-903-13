const db = require('../config/db');
const { generateReport } = require('../services/reports/whatSellsTogether');

jest.mock('../config/db');

describe('generateReport', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should generate report for valid date range', async () => {
        const mockReq = {
            body: {
                startDate: '2022-01-01',
                endDate: '2022-01-31',
            },
        };
        const mockRes = {
            status: jest.fn(() => mockRes),
            json: jest.fn(),
        };

        const mockViewQueryResult = { rowCount: 1 };
        const mockSelectQueryResult = {
            rows: [
                { m1name: 'Item 1', m2name: 'Item 2', paircount: 5 },
                { m1name: 'Item 2', m2name: 'Item 3', paircount: 3 },
            ],
        };

        db.query.mockImplementation((query, callback) => {
            if (query.includes('CREATE VIEW')) {
                callback(null, mockViewQueryResult);
            } else if (query.includes('SELECT')) {
                callback(null, mockSelectQueryResult);
            } else if (query.includes('DROP VIEW')) {
                callback(null, {});
            }
        });

        await generateReport(mockReq, mockRes);

        expect(db.query).toHaveBeenCalledTimes(3);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockSelectQueryResult.rows);
    });

    test('should handle database query error', async () => {
        const mockReq = {
            body: {
                startDate: '2022-01-01',
                endDate: '2022-01-31',
            },
        };
        const mockRes = {
            status: jest.fn(() => mockRes),
            json: jest.fn(),
        };

        const mockError = new Error('Database error');
        db.query.mockImplementation((query, callback) => {
            callback(mockError);
        });

        try {
            await generateReport(mockReq, mockRes);
        } catch (error) {
            expect(error).toBe(mockError);
        }

        expect(db.query).toHaveBeenCalledTimes(1); 
        expect(mockRes.status).toHaveBeenCalledWith(500);
    });
    
});
