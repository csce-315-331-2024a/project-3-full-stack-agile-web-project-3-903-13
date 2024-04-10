import { getMenuItems, getMenuItemIngredients, getInventoryItems, addMenuItem, updateMenuItemPrice, updateMenuItemCat, updateMenuItemIngred, removeMenuItem } from "../src/app/(employee)/employee/manager/menu-items/page";

// Mock fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
  })
);

describe('useClient functions', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('getMenuItems should fetch menu items', async () => {
    await getMenuItems();
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/menuitems');
  });

  test('getMenuItemIngredients should fetch ingredients for a menu item', async () => {
    const menuItem = { itemName: 'SomeMenuItem' };
    await getMenuItemIngredients(menuItem);
    const expectedUrl = 'http://localhost:5000/api/menuitems/getIngreds?itemName=SomeMenuItem';
    expect(fetch).toHaveBeenCalledWith(expectedUrl);
  });

  test('getInventoryItems should fetch inventory items', async () => {
    await getInventoryItems();
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/inventory');
  });

  test('addMenuItem should add a menu item', async () => {
    const menuItem = { itemName: 'SomeMenuItem', price: 10, category: 0 };
    await addMenuItem(menuItem);
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/menuitems', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menuItem),
    });
  });

  test('updateMenuItemPrice should update menu item price', async () => {
    const menuItem = { itemName: 'SomeMenuItem', newPrice: 15 };
    await updateMenuItemPrice(menuItem);
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/menuitems/updatePrice', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menuItem),
    });
  });

  test('updateMenuItemCat should update menu item category', async () => {
    const menuItem = { itemName: 'SomeMenuItem', newCat: 1 };
    await updateMenuItemCat(menuItem);
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/menuitems/updateCat', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menuItem),
    });
  });

  test('updateMenuItemIngred should update menu item ingredients', async () => {
    const menuItem = { itemName: 'SomeMenuItem', ingredients: [{ inventID: 1, name: 'Ingredient1', quantity: 2 }] };
    await updateMenuItemIngred(menuItem);
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/menuitems/updateIngred', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menuItem),
    });
  });

  test('removeMenuItem should remove a menu item', async () => {
    const menuItem = { itemName: 'SomeMenuItem' };
    await removeMenuItem(menuItem);
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/menuitems', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menuItem),
    });
  });
});
