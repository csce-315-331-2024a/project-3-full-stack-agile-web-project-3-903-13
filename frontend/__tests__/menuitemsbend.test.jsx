// Import the retrieveMenuItems function
const { retrieveMenuItems } = require('../../api/services/menuitems');

// Mock the database module
jest.mock("../../api/config/db", () => ({
  query: jest.fn(),
}));

// Import the database module after mocking
const db = require('../../api/config/db');

describe('retrieveMenuItems function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should retrieve menu items successfully', async () => {
    // Mock the database query response with sample menu items
    const sampleMenuItems = [
      { menuid: 1, itemName: 'Burger', price: 9.99, category: 0 },
      { menuid: 1, itemName: 'Cheeseburger', price: 9.99, category: 0 },
    ];
    db.query.mockImplementation((query, callback) => {
      callback(null, { rows: sampleMenuItems });
    });

    // Mock request and response objects
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the function
    await retrieveMenuItems(req, res);

    // Check if the appropriate status and data are sent
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(sampleMenuItems);
  });

  // Add more test cases for error handling and edge cases
});
