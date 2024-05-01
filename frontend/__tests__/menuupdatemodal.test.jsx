import React from 'react';
import { render, fireEvent, waitFor, getByTestId } from '@testing-library/react';
import axios from 'axios'; // Mock axios
import MenuUpdateModal, { getMenuItems, getMenuItemsWithIngredients } from '../src/components/MenuUpdateModal'; // Update the import path

jest.mock('axios');

const menuItemsMock = [
    { menuid: 1, itemname: 'Item 1' },
    { menuid: 2, itemname: 'Item 2' },
    // Add more mock data as needed
  ];

describe('MenuUpdateModal', () => {
  // Test getMenuItems function
  describe('getMenuItems', () => {
    it('fetches menu items successfully', async () => {
      const mockData = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
      axios.get.mockResolvedValueOnce({ data: mockData });

      const data = await getMenuItems();
      expect(data).toEqual(mockData);
    });

    it('handles error when fetching menu items', async () => {
      const errorMessage = 'Failed to fetch menu items';
      axios.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(getMenuItems()).rejects.toThrow(errorMessage);
    });
  });

  // Test getMenuItemsWithIngredients function similarly
  
  // Test component rendering and user interactions
  describe('Component', () => {
    const menuItemsMock = [
        { menuid: 1, itemname: 'Item 1' },
        { menuid: 2, itemname: 'Item 2' },
        // Add more mock data as needed
      ];
    test('renders correctly', () => {
        // Render the component with mock menuItems data
        const { getByText } = render(
          <MenuUpdateModal
            onClose={() => {}}
            isOpen={true}
            menuItems={menuItemsMock}
            inventoryItems={[]} // Add mock inventoryItems if needed
            setMenuItemsGrid={() => {}} // Mock setMenuItemsGrid function
          />
        );
    
        // Add your assertion here, for example:
        expect(getByText('UPDATE MENU ITEMS')).toBeInTheDocument();
      });

    it('submits update request when form is filled', async () => {
      const { getByText, getByPlaceholderText, getByTestId } = render(
        <MenuUpdateModal
          onClose={() => {}}
          isOpen={true}
          menuItems={menuItemsMock} // Pass mock data for menuItems
          inventoryItems={[]} // Add mock inventoryItems if needed
          setMenuItemsGrid={() => {}} // Mock setMenuItemsGrid function
        />
      );
      const updateButton = getByText('UPDATE');
      const priceInput = getByPlaceholderText('New Price');
      const itemNameInput = getByTestId('menu select');

      // Mock axios patch request
      axios.patch.mockResolvedValueOnce({ success: true, message: 'Update successful' });

      // Simulate user interactions
      fireEvent.change(itemNameInput, { target: { value: 'Item 1' } });
      fireEvent.change(priceInput, { target: { value: '10' } });
      fireEvent.click(updateButton);

      // Wait for the update to complete
      await waitFor(() => {
        expect(axios.patch).toHaveBeenCalled();
        expect(axios.patch).toHaveBeenCalledWith(expect.any(String), { itemName: 'Item 1', newPrice: '10' }, expect.any(Object));
        // Add more assertions based on the expected behavior after update
      });
    });

    // Add more test cases for other user interactions and edge cases
  });
});
