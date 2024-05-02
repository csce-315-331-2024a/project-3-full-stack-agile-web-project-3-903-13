const db = require('../config/db');
const {
    retrieveMenuItems,
    retrieveMenuItemIngredients,
    addMenuItem,
    updateMenuItemPrice,
    updateMenuItemCat,
	updateMenuItemIngred,
    removeMenuItem,
	retrieveSeasonalInfo,
	getDetails,
	updateMenuItemDescription,
	updateMenuItemDiet,
	updateMenuItemCalories,
	updateMenuItemAllergy
} = require('../services/menuitems');

jest.mock('../config/db');

describe('MenuItems Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('retrieveMenuItems', () => {
        test('should return all menu items on success', async () => {
            const mockItems = [{ id: 1, itemName: 'Pizza', price: 9.99 }];
            db.query.mockImplementation((queryText, callback) => callback(null, { rows: mockItems }));

            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await retrieveMenuItems(null, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockItems);
        });

        test('should return 500 if database query fails', async () => {
            db.query.mockImplementation((queryText, callback) => callback(new Error("Internal Server Error")));

            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            await retrieveMenuItems(null, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith("Internal Server Error");
        });
    });

    describe('retrieveMenuItemIngredients', () => {
        const itemName = 'Pizza';

        test('should return ingredients for a specific menu item', async () => {
            const mockIngredients = [{ inventid: 1, ingredientname: 'Cheese', quantity: 1 }];
            db.query
                .mockImplementationOnce((sql, params, callback) => callback(null, { rows: [{ itemname: itemName }], rowCount: 1 }))
                .mockImplementationOnce((sql, params, callback) => callback(null, { rows: mockIngredients }));

            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockReq = { query: { itemName } };

            await retrieveMenuItemIngredients(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockIngredients);
        });

        test('should return 401 if the item does not exist', async () => {
            db.query.mockImplementation((sql, params, callback) => callback(null, { rows: [], rowCount: 0 }));

            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
            const mockReq = { query: { itemName } };

            await retrieveMenuItemIngredients(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.send).toHaveBeenCalledWith("Item Doesn't exist");
        });

        test('should return 500 if database query fails', async () => {
            db.query.mockImplementation((sql, params, callback) => callback(new Error("Query Failed")));

            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
            const mockReq = { query: { itemName } };

            await retrieveMenuItemIngredients(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.send).toHaveBeenCalledWith("Query Failed");
        });

	    test('should return 500 if there is an error in retrieving ingredients', async () => {
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
			const mockReq = { query: { itemName } };
	
			db.query
				.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [{ menuid: 1, itemname: itemName }], rowCount: 1 }))
				.mockImplementationOnce((sql, params, callback) => callback(new Error("Internal Server Error")));
	
			await retrieveMenuItemIngredients(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(500);
			expect(mockRes.send).toHaveBeenCalledWith("Internal Server Error");
		});
    });

	describe('addMenuItem', () => {
		const mockReq = {
			body: {
				itemName: 'New Dish',
				price: 10.99,
				category: 'Main Course',
				ingredients: [
					{ inventID: 1, quantity: 2 },
					{ inventID: 2, quantity: 1 }
				],
				isSeasonal: true,
				expirationDate: '2023-12-31'
			}
		};
	
		test('should add a new menu item successfully', async () => {
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
	
			db.query
				.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [], rowCount: 0 })) 
				.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [{ menuid: 1 }], rowCount: 1 })) 
				.mockImplementationOnce((sql, params, callback) => callback(null, {})); 
	
			for (let ingredient of mockReq.body.ingredients) {
				db.query.mockImplementationOnce((sql, params, callback) => callback(null, {}));
			}
	
			await addMenuItem(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(201);
			expect(mockRes.send).toHaveBeenCalledWith('Menu item added successfully');
		});
	
		test('should return 500 if checking if item exists fails', async () => {
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
	
			db.query.mockImplementationOnce((sql, params, callback) => callback(new Error('Internal Server Error')));
	
			await addMenuItem(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(500);
			expect(mockRes.send).toHaveBeenCalledWith('Internal Server Error');
		});
	
		test('should return 401 if item already exists', async () => {
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
	
			db.query.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [mockReq.body], rowCount: 1 }));
	
			await addMenuItem(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(401);
			expect(mockRes.send).toHaveBeenCalledWith('Item Already exists');
		});
	
		test('should return 500 if there is an error during item insertion', async () => {
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
	
			db.query
				.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [], rowCount: 0 }))
				.mockImplementationOnce((sql, params, callback) => callback(new Error('Internal Server Error')));
	
			await addMenuItem(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(500);
			expect(mockRes.send).toHaveBeenCalledWith('Internal Server Error');
		});
	});

	describe('addMenuItem', () => {
		const mockReq = {
			body: {
				itemName: 'Seasonal Dish',
				price: 15.99,
				category: 'Seasonal',
				ingredients: [
					{ inventID: 1, quantity: 2 }
				],
				isSeasonal: true,
				expirationDate: '2023-12-31'
			}
		};
	
		test('should return 400 if there is an error adding the seasonal item', async () => {
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
	
			db.query
				.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [], rowCount: 0 })) 
				.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [{ menuid: 1 }], rowCount: 1 })) 
				.mockImplementationOnce((sql, params, callback) => callback(new Error('Error adding seasonal item'))); 
	
			await addMenuItem(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(400);
			expect(mockRes.send).toHaveBeenCalledWith('Could not add seasonal item successfully');
		});
	});

	describe('updateMenuItemPrice', () => {
		const itemName = 'Existing Dish';
		const newPrice = 20.99;
	
		test('should update item price successfully and return success message', async () => {
			const mockReq = {
				body: { itemName, newPrice }
			};
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
	
			db.query
				.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [{ itemName }], rowCount: 1 }))
				.mockImplementationOnce((sql, params, callback) => callback(null, { rowCount: 1 }));
	
			await updateMenuItemPrice(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(202);
			expect(mockRes.send).toHaveBeenCalledWith(`Price of ${itemName} updated successfully`);
		});
	
		test('should return 500 if there is an error checking if the item exists', async () => {
			const mockReq = {
				body: { itemName, newPrice }
			};
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
	
			db.query.mockImplementationOnce((sql, params, callback) => callback(new Error('Database error')));
	
			await updateMenuItemPrice(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(500);
		});
	
		test('should return 401 if the item does not exist', async () => {
			const mockReq = {
				body: { itemName, newPrice }
			};
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
	
			db.query.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [], rowCount: 0 }));
	
			await updateMenuItemPrice(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(401);
			expect(mockRes.send).toHaveBeenCalledWith("Item Doesn't exist");
		});
	
		test('should return 500 if there is an error during the update operation', async () => {
			const mockReq = {
				body: { itemName, newPrice }
			};
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
	
			db.query
				.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [{ itemName }], rowCount: 1 }))
				.mockImplementationOnce((sql, params, callback) => callback(new Error('Update error')));
	
			await updateMenuItemPrice(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(500);
		});
	});
	
	describe('updateMenuItemCat', () => {
		const itemName = 'Existing Dish';
		const newCat = 'New Category';
	
		test('should update item category successfully and return success message', async () => {
			const mockReq = {
				body: { itemName, newCat }
			};
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
	
			db.query
				.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [{ itemName }], rowCount: 1 }))
				.mockImplementationOnce((sql, params, callback) => callback(null, { rowCount: 1 })); 
	
			await updateMenuItemCat(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(202);
			expect(mockRes.send).toHaveBeenCalledWith(`Category of ${itemName} updated successfully`);
		});
	
		test('should return 500 if there is an error checking if the item exists', async () => {
			const mockReq = {
				body: { itemName, newCat }
			};
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
	
			db.query.mockImplementationOnce((sql, params, callback) => callback(new Error('Database error')));
	
			await updateMenuItemCat(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(500);
		});
	
		test('should return 401 if the item does not exist', async () => {
			const mockReq = {
				body: { itemName, newCat }
			};
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
	
			db.query.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [], rowCount: 0 }));
	
			await updateMenuItemCat(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(401);
			expect(mockRes.send).toHaveBeenCalledWith("Item Doesn't exist");
		});
	
		test('should return 500 if there is an error during the update operation', async () => {
			const mockReq = {
				body: { itemName, newCat }
			};
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
	
			db.query
				.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [{ itemName }], rowCount: 1 }))
				.mockImplementationOnce((sql, params, callback) => callback(new Error('Update error')));
	
			await updateMenuItemCat(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(500);
		});
	});
	
	describe('updateMenuItemIngred', () => {
		const itemName = 'Existing Dish';
		const ingredients = [{ inventID: 1, quantity: 2 }, { inventID: 2, quantity: 3 }];
	
		test('should update item ingredients successfully and return success message', async () => {
			const mockReq = {
				body: { itemName, ingredients }
			};
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
	
			db.query
				.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [{ menuid: 1 }], rowCount: 1 })) 
				.mockImplementationOnce((sql, params, callback) => callback(null, {})) 
				.mockImplementation((sql, params, callback) => callback(null, {})); 
	
			await updateMenuItemIngred(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(202);
			expect(mockRes.send).toHaveBeenCalledWith(`Ingredients of ${itemName} updated successfully`);
		});
	
		test('should return 500 if there is an error checking if the item exists', async () => {
			const mockReq = {
				body: { itemName, ingredients }
			};
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
	
			db.query.mockImplementationOnce((sql, params, callback) => callback(new Error('Database error')));
	
			await updateMenuItemIngred(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(500);
		});
	
		test('should return 401 if the item does not exist', async () => {
			const mockReq = {
				body: { itemName, ingredients }
			};
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
	
			db.query.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [], rowCount: 0 }));
	
			await updateMenuItemIngred(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(401);
			expect(mockRes.send).toHaveBeenCalledWith("Item Doesn't exist");
		});
	
		test('should return 500 if there is an error during the delete operation', async () => {
			const mockReq = {
				body: { itemName, ingredients }
			};
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
	
			db.query
				.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [{ menuid: 1 }], rowCount: 1 }))
				.mockImplementationOnce((sql, params, callback) => callback(new Error('Delete error')));
	
			await updateMenuItemIngred(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(500);
		});
	
		test('should return 500 if there is an error during the insert operation', async () => {
			const mockReq = {
				body: { itemName, ingredients }
			};
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
	
			db.query
				.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [{ menuid: 1 }], rowCount: 1 }))
				.mockImplementationOnce((sql, params, callback) => callback(null, {}))
				.mockImplementationOnce((sql, params, callback) => callback(new Error('Insert error')));
	
			await updateMenuItemIngred(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(500);
		});
	});
	
	describe('removeMenuItem', () => {
		const itemName = 'Existing Dish';
	
		test('should remove the menu item successfully and return success message', async () => {
			const mockReq = {
				body: { itemName }
			};
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
	
			db.query
				.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [{ menuid: 1 }], rowCount: 1 }))
				.mockImplementationOnce((sql, params, callback) => callback(null, {})) 
				.mockImplementationOnce((sql, params, callback) => callback(null, {}))
				.mockImplementationOnce((sql, params, callback) => callback(null, {})); 
	
			await removeMenuItem(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(200);
			expect(mockRes.send).toHaveBeenCalledWith(`Menu item with name ${itemName} removed successfully`);
		});
	
		test('should return 500 if there is an error checking if the menu item exists', async () => {
			const mockReq = {
				body: { itemName }
			};
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
	
			db.query.mockImplementationOnce((sql, params, callback) => callback(new Error('Database error')));
	
			await removeMenuItem(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(500);
		});
	
		test('should return 404 if the menu item does not exist', async () => {
			const mockReq = {
				body: { itemName }
			};
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
	
			db.query.mockImplementationOnce((sql, params, callback) => callback(null, { rowCount: 0 }));
	
			await removeMenuItem(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockRes.send).toHaveBeenCalledWith("Menu item not found");
		});
	
		test('should return 500 if there is an error during the ingredients deletion operation', async () => {
			const mockReq = {
				body: { itemName }
			};
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
	
			db.query
				.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [{ menuid: 1 }], rowCount: 1 }))
				.mockImplementationOnce((sql, params, callback) => callback(new Error('Delete error')));
	
			await removeMenuItem(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(500);
		});
	});
	
	describe('removeMenuItem', () => {
		const itemName = 'Seasonal Dish';
	
		test('should return 500 if there is an error during the seasonal items deletion operation', async () => {
			const mockReq = {
				body: { itemName }
			};
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
	
			db.query
				.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [{ menuid: 1 }], rowCount: 1 })) 
				.mockImplementationOnce((sql, params, callback) => callback(null, {})) 
				.mockImplementationOnce((sql, params, callback) => callback(new Error('Delete error from seasonalitems'))); 
	
			await removeMenuItem(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(500);
			expect(mockRes.send).toHaveBeenCalledWith("Internal Server Error");
		});
	});
	
	describe('removeMenuItem', () => {
		const itemName = 'Seasonal Dish';
	
		test('should return 500 if there is an error during the menu item deletion operation', async () => {
			const mockReq = {
				body: { itemName }
			};
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
	
			db.query
				.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [{ menuid: 1 }], rowCount: 1 }))
				.mockImplementationOnce((sql, params, callback) => callback(null, {})) 
				.mockImplementationOnce((sql, params, callback) => callback(null, {})) 
				.mockImplementationOnce((sql, params, callback) => callback(new Error('Delete error from menuitems')));
	
			await removeMenuItem(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(500);
			expect(mockRes.send).toHaveBeenCalledWith("Internal Server Error");
		});
	});
	
	describe('retrieveSeasonalInfo', () => {
		const itemName = 'Seasonal Pizza';
	
		test('should return seasonal information for an existing item', async () => {
			const mockSeasonalInfo = [{ menuid: 1, expirationdate: '2023-12-31' }];
			db.query
				.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [{ menuid: 1 }], rowCount: 1 }))
				.mockImplementationOnce((sql, params, callback) => callback(null, { rows: mockSeasonalInfo }));
	
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn()
			};
			const mockReq = { query: { itemName } };
	
			await retrieveSeasonalInfo(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(200);
			expect(mockRes.json).toHaveBeenCalledWith(mockSeasonalInfo);
		});
	
		test('should return 401 if the item does not exist', async () => {
			db.query.mockImplementation((sql, params, callback) => callback(null, { rows: [], rowCount: 0 }));
	
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
			const mockReq = { query: { itemName } };
	
			await retrieveSeasonalInfo(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(401);
			expect(mockRes.send).toHaveBeenCalledWith("Item Doesn't exist");
		});
	
		test('should return 400 if there is an error in the initial query', async () => {
			db.query.mockImplementationOnce((sql, params, callback) => callback(new Error("Query Failed")));
	
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
			const mockReq = { query: { itemName } };
	
			await retrieveSeasonalInfo(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(400);
			expect(mockRes.send).toHaveBeenCalledWith("Query Failed");
		});
	
		test('should return 500 if there is an error in the second query', async () => {
			db.query
				.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [{ menuid: 1 }], rowCount: 1 }))
				.mockImplementationOnce((sql, params, callback) => callback(new Error("Internal Server Error")));
	
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
			const mockReq = { query: { itemName } };
	
			await retrieveSeasonalInfo(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(500);
			expect(mockRes.send).toHaveBeenCalledWith("Internal Server Error");
		});
	});

	describe('getDetails', () => {
		const itemName = 'Special Pizza';
	
		test('should return details of the menu item when found', async () => {
			const mockResults = [{ id: 1, itemName: 'Special Pizza', price: 15.99 }];
			db.query.mockImplementation((sql, params, callback) => callback(null, { rows: mockResults }));
	
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn()
			};
			const mockReq = { query: { name: itemName } };
	
			await getDetails(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(200);
			expect(mockRes.json).toHaveBeenCalledWith(mockResults);
		});
	
		test('should return 500 if there is a database error', async () => {
			db.query.mockImplementation((sql, params, callback) => callback(new Error("Database error"), null));
	
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
			const mockReq = { query: { name: itemName } };
	
			await getDetails(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(500);
			expect(mockRes.send).toHaveBeenCalledWith("Internal Server Error");
		});
	});

	describe('updateMenuItemDescription', () => {
		const itemName = 'Classic Burger';
		const newDescription = 'Updated description with more details on ingredients.';
	
		test('should update the description successfully and return a success message', async () => {
			// Mock the database response for checking if the item exists
			db.query
				.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [{ itemName }], rowCount: 1 }))
				.mockImplementationOnce((sql, params, callback) => callback(null, { rowCount: 1 }));
	
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
			const mockReq = {
				body: { itemName, newDes: newDescription }
			};
	
			await updateMenuItemDescription(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(202);
			expect(mockRes.send).toHaveBeenCalledWith(`Description of ${itemName} updated successfully`);
		});
	
		test('should return 401 if the item does not exist', async () => {
			db.query.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [], rowCount: 0 }));
	
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
			const mockReq = {
				body: { itemName, newDes: newDescription }
			};
	
			await updateMenuItemDescription(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(401);
			expect(mockRes.send).toHaveBeenCalledWith("Item Doesn't exist");
		});

	    test('should return 500 if there is an error checking if the item exists', async () => {
			db.query.mockImplementationOnce((sql, params, callback) => callback(new Error('Database error'), null));
	
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
			const mockReq = {
				body: { itemName, newDes: newDescription }
			};
	
			await updateMenuItemDescription(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(500);
		});

	    test('should return 500 if there is an error during the update operation', async () => {
			db.query
				.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [{ itemName }], rowCount: 1 }))
				.mockImplementationOnce((sql, params, callback) => callback(new Error('Update error')));
	
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
			const mockReq = {
				body: { itemName, newDes: newDescription }
			};
	
			await updateMenuItemDescription(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(500);
		});
	});

	describe('updateMenuItemDiet', () => {
		const itemName = 'Vegan Salad';
		const newDiet = 'Vegan, Gluten-Free';
	
		test('should update the special diet successfully and return a success message', async () => {
			// Mock the database response for checking if the item exists
			db.query
				.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [{ itemName }], rowCount: 1 }))
				.mockImplementationOnce((sql, params, callback) => callback(null, { rowCount: 1 }));
	
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
			const mockReq = {
				body: { itemName, newDiet }
			};
	
			await updateMenuItemDiet(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(202);
			expect(mockRes.send).toHaveBeenCalledWith(`Special Diet of ${itemName} updated successfully`);
		});
	
		test('should return 500 if there is an error checking if the item exists', async () => {
			db.query.mockImplementationOnce((sql, params, callback) => callback(new Error('Database error'), null));
	
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
			const mockReq = {
				body: { itemName, newDiet }
			};
	
			await updateMenuItemDiet(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(500);
		});
	
		test('should return 401 if the item does not exist', async () => {
			db.query.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [], rowCount: 0 }));
	
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
			const mockReq = {
				body: { itemName, newDiet }
			};
	
			await updateMenuItemDiet(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(401);
			expect(mockRes.send).toHaveBeenCalledWith("Item Doesn't exist");
		});
	
		test('should return 500 if there is an error during the update operation', async () => {
			db.query
				.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [{ itemName }], rowCount: 1 }))
				.mockImplementationOnce((sql, params, callback) => callback(new Error('Update error')));
	
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
			const mockReq = {
				body: { itemName, newDiet }
			};
	
			await updateMenuItemDiet(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(500);
		});
	});

	describe('updateMenuItemCalories', () => {
		const itemName = 'Grilled Chicken';
		const newCalories = 550;
	
		test('should update the calories successfully and return a success message', async () => {
			// Mock the database response for checking if the item exists
			db.query
				.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [{ itemName }], rowCount: 1 }))
				.mockImplementationOnce((sql, params, callback) => callback(null, { rowCount: 1 }));
	
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
			const mockReq = {
				body: { itemName, newCalories }
			};
	
			await updateMenuItemCalories(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(202);
			expect(mockRes.send).toHaveBeenCalledWith(`Calories of ${itemName} updated successfully`);
		});
	
		test('should return 500 if there is an error checking if the item exists', async () => {
			db.query.mockImplementationOnce((sql, params, callback) => callback(new Error('Database error'), null));
	
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
			const mockReq = {
				body: { itemName, newCalories }
			};
	
			await updateMenuItemCalories(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(500);
		});
	
		test('should return 401 if the item does not exist', async () => {
			db.query.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [], rowCount: 0 }));
	
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
			const mockReq = {
				body: { itemName, newCalories }
			};
	
			await updateMenuItemCalories(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(401);
			expect(mockRes.send).toHaveBeenCalledWith("Item Doesn't exist");
		});
	
		test('should return 500 if there is an error during the update operation', async () => {
			db.query
				.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [{ itemName }], rowCount: 1 }))
				.mockImplementationOnce((sql, params, callback) => callback(new Error('Update error')));
	
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
			const mockReq = {
				body: { itemName, newCalories }
			};
	
			await updateMenuItemCalories(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(500);
		});
	});

	describe('updateMenuItemAllergy', () => {
		const itemName = 'Nutty Ice Cream';
		const newAllergy = 'Contains nuts';
	
		test('should update the allergy information successfully and return a success message', async () => {
			// Mock the database response for checking if the item exists
			db.query
				.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [{ itemName }], rowCount: 1 }))
				.mockImplementationOnce((sql, params, callback) => callback(null, { rowCount: 1 }));
	
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
			const mockReq = {
				body: { itemName, newAllergy }
			};
	
			await updateMenuItemAllergy(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(202);
			expect(mockRes.send).toHaveBeenCalledWith(`Allergy of ${itemName} updated successfully`);
		});
	
		test('should return 500 if there is an error checking if the item exists', async () => {
			db.query.mockImplementationOnce((sql, params, callback) => callback(new Error('Database error'), null));
	
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
			const mockReq = {
				body: { itemName, newAllergy }
			};
	
			await updateMenuItemAllergy(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(500);
		});
	
		test('should return 401 if the item does not exist', async () => {
			db.query.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [], rowCount: 0 }));
	
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
			const mockReq = {
				body: { itemName, newAllergy }
			};
	
			await updateMenuItemAllergy(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(401);
			expect(mockRes.send).toHaveBeenCalledWith("Item Doesn't exist");
		});
	
		test('should return 500 if there is an error during the update operation', async () => {
			db.query
				.mockImplementationOnce((sql, params, callback) => callback(null, { rows: [{ itemName }], rowCount: 1 }))
				.mockImplementationOnce((sql, params, callback) => callback(new Error('Update error')));
	
			const mockRes = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};
			const mockReq = {
				body: { itemName, newAllergy }
			};
	
			await updateMenuItemAllergy(mockReq, mockRes);
			expect(mockRes.status).toHaveBeenCalledWith(500);
		});
	});
});