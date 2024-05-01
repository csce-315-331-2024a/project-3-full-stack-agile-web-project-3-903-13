// InventAddModal.test.js
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import InventAddModal, { getInventoryItems, addInventoryItem } from '../src/components/InventAddModal';

jest.mock('axios');

describe('InventAddModal', () => {
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

      await expect(getInventoryItems()).rejects.toThrow(errorMessage);
    });
  });

  describe('addInventoryItem', () => {
    it('should add an inventory item successfully', async () => {
      const newItem = { itemName: 'New Item', count: 5, price: 19.99, mincount: 2 };
      const mockResponse = { success: true, message: 'Item added successfully' };
      axios.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await addInventoryItem(newItem);

      expect(axios.post).toHaveBeenCalledWith('https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/inventory', newItem, { headers: { 'Content-Type': 'application/json' } });
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when adding an inventory item', async () => {
      const newItem = { itemName: 'New Item', count: 5, price: 19.99, mincount: 2 };
      const errorMessage = 'Failed to add item';
      axios.post.mockRejectedValueOnce(new Error(errorMessage));

      await expect(addInventoryItem(newItem)).rejects.toThrow(errorMessage);
    });
  });

  describe('InventAddModal component', () => {
    it('should render the modal when isOpen is true', () => {
      const { getByPlaceholderText } = render(<InventAddModal isOpen={true} onClose={jest.fn()} inventoryItems={[]} setInventoryItems={jest.fn()} />);

      expect(getByPlaceholderText('Item Name')).toBeInTheDocument();
      expect(getByPlaceholderText('Count')).toBeInTheDocument();
      expect(getByPlaceholderText('Price')).toBeInTheDocument();
      expect(getByPlaceholderText('Minimum Count')).toBeInTheDocument();
    });

    it('should not render the modal when isOpen is false', () => {
      const { queryByPlaceholderText } = render(<InventAddModal isOpen={false} onClose={jest.fn()} inventoryItems={[]} setInventoryItems={jest.fn()} />);

      expect(queryByPlaceholderText('Item Name')).toBeNull();
      expect(queryByPlaceholderText('Count')).toBeNull();
      expect(queryByPlaceholderText('Price')).toBeNull();
      expect(queryByPlaceholderText('Minimum Count')).toBeNull();
    });

    it('should display error message for invalid form data', async () => {
      const { getByPlaceholderText, getByText } = render(<InventAddModal isOpen={true} onClose={jest.fn()} inventoryItems={[]} setInventoryItems={jest.fn()} />);

      fireEvent.submit(getByPlaceholderText('Item Name').parentNode);

      await waitFor(() => {
        expect(getByText('Please fill out all fields correctly.')).toBeInTheDocument();
      });
    });

    it('should call addInventoryItem and fetch inventory items on successful form submission', async () => {
      const newItem = { itemName: 'New Item', count: 5, price: 19.99, mincount: 2 };
      const mockResponse = { success: true, message: 'Item added successfully' };
      const mockInventoryItems = [{ id: 1, itemName: 'Item 1', count: 10, price: 9.99, mincount: 5 }];
      const setInventoryItems = jest.fn();
      axios.post.mockResolvedValueOnce({ data: mockResponse });
      axios.get.mockResolvedValueOnce({ data: mockInventoryItems });

      const { getByPlaceholderText, getByText } = render(<InventAddModal isOpen={true} onClose={jest.fn()} inventoryItems={[]} setInventoryItems={setInventoryItems} />);

      fireEvent.change(getByPlaceholderText('Item Name'), { target: { value: newItem.itemName } });
      fireEvent.change(getByPlaceholderText('Count'), { target: { value: newItem.count } });
      fireEvent.change(getByPlaceholderText('Price'), { target: { value: newItem.price } });
      fireEvent.change(getByPlaceholderText('Minimum Count'), { target: { value: newItem.mincount } });

      fireEvent.submit(getByPlaceholderText('Item Name').parentNode);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
        expect(axios.get).toHaveBeenCalled();
      });
    });
  });
});