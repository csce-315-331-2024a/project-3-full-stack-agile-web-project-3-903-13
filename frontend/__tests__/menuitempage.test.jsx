import axios from 'axios';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ManagerPage, { getMenuItems, getMenuItemsWithIngredients, getInventoryItems, getCategoryLabel, getDietCategoryLabel, getAllergyLabel } from '../src/app/(employee)/employee/manager/menu-items/page';

jest.mock('axios');

describe('useClient', () => {
  describe('API functions', () => {
    test('getMenuItems', async () => {
      const mockData = [{ id: 1, name: 'Burger' }];
      axios.get.mockResolvedValueOnce({ data: mockData });

      const menuItems = await getMenuItems();

      expect(menuItems).toEqual(mockData);
    });

    test('getMenuItemsWithIngredients', async () => {
      const mockMenuItems = [{ id: 1, name: 'Burger' }];
      const mockIngredients = [{ id: 1, name: 'Lettuce', quantity: 1 }];
      axios.get.mockResolvedValueOnce({ data: mockMenuItems });
      axios.get.mockResolvedValueOnce({ data: mockIngredients });

      const menuItemsWithIngredients = await getMenuItemsWithIngredients();

      expect(menuItemsWithIngredients).toEqual([{ id: 1, name: 'Burger', ingredients: mockIngredients }]);
    });

    test('getInventoryItems', async () => {
      const mockData = [{ id: 1, name: 'Lettuce' }];
      axios.get.mockResolvedValueOnce({ data: mockData });

      const inventoryItems = await getInventoryItems();

      expect(inventoryItems).toEqual(mockData);
    });
  });

  describe('ManagerPage', () => {
    test('fetches menu items on mount', async () => {
      const mockData = [{ id: 1, name: 'Burger' }];
      axios.get.mockResolvedValueOnce({ data: mockData });

      render(<ManagerPage />);

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith('https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems');
      });
    });

    // Add more tests for state management, event handling, etc.
  });
});
