// InventRemoveModal.test.js
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import InventRemoveModal, { getInventoryItems, removeInventoryItem } from '../src/components/InventRemoveModal';

jest.mock('axios');

describe('InventRemoveModal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getInventoryItems', () => {
    it('should fetch inventory items successfully', async () => {
      const mockData = [{ id: 1, itemName: 'Item 1', count: 10, price: 9.99, mincount: 5 }];
      axios.get.mockResolvedValueOnce({ data: mockData });

      const result = await getInventoryItems();

      expect(axios.get).toHaveBeenCalledWith('https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/inventory');
      expect(result).toEqual(mockData);
    });

    it('should handle errors when fetching inventory items', async () => {
      const errorMessage = 'Network Error';
      axios.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(getInventoryItems()).rejects.toThrowError(errorMessage);
    });
  });

  describe('removeInventoryItem', () => {
    it('should remove an inventory item successfully', async () => {
      const itemToRemove = { itemName: 'Item 1' };
      const mockResponse = { data: { success: true } };
      axios.delete.mockResolvedValueOnce(mockResponse);

      const result = await removeInventoryItem(itemToRemove);

      expect(axios.delete).toHaveBeenCalledWith('https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/inventory', { data: itemToRemove });
      expect(result).toEqual({ success: true, message: 'Inventory item removed successfully' });
    });
  });

  describe('InventRemoveModal component', () => {
    it('should render the modal when isOpen is true', () => {
      const { getByText } = render(<InventRemoveModal isOpen={true} onClose={jest.fn()} inventoryItems={[]} setInventoryItems={jest.fn()} />);

      expect(getByText('REMOVE INVENTORY ITEM')).toBeInTheDocument();
    });

    it('should not render the modal when isOpen is false', () => {
      const { queryByText } = render(<InventRemoveModal isOpen={false} onClose={jest.fn()} inventoryItems={[]} setInventoryItems={jest.fn()} />);

      expect(queryByText('REMOVE INVENTORY ITEM')).toBeNull();
    });

  });
});