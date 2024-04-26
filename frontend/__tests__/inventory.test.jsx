import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import InventoryPage from '../src/app/(employee)/employee/manager/inventory/page';

jest.mock('axios');

describe('InventoryPage', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: [] });
    axios.patch.mockResolvedValue({ data: { message: 'Success' } });
    axios.post.mockResolvedValue({ data: { message: 'Success' } });
    axios.delete.mockResolvedValue({ data: { message: 'Success' } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the inventory items', async () => {
    axios.get.mockResolvedValue({ data: [{ inventid: 1, ingredientname: 'Item 1', count: 10, price: 5.99, mincount: 5 }] });
    render(<InventoryPage />);
    const items = await waitFor(() => screen.getAllByText('Item 1'));
    expect(items.length).toBeGreaterThan(0);
  });

  test('adds an inventory item', async () => {
    render(<InventoryPage />);
    const itemNameInput = screen.getByPlaceholderText('Item Name');
    const countInput = screen.getByPlaceholderText('Count');
    const priceInput = screen.getByPlaceholderText('Price');
    const minCountInput = screen.getByPlaceholderText('Minimum Count');
    const addButton = screen.getByText('ADD');

    fireEvent.change(itemNameInput, { target: { value: 'New Item' } });
    fireEvent.change(countInput, { target: { value: '20' } });
    fireEvent.change(priceInput, { target: { value: '9.99' } });
    fireEvent.change(minCountInput, { target: { value: '10' } });
    fireEvent.click(addButton);

    const successMessage = await waitFor(() => screen.getByText('Success'));
    expect(successMessage).toBeInTheDocument();
    expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/inventory', {
      itemName: 'New Item',
      count: '20',
      price: '9.99',
      mincount: '10',
    }, { headers: { 'Content-Type': 'application/json' } });
  });

  test('adds an inventory item - error handling', async () => {
    render(<InventoryPage />);
    // Simulate API error (e.g., network error)
    axios.post.mockRejectedValueOnce(new Error('Network Error'));
  
    const itemNameInput = screen.getByPlaceholderText('Item Name');
    const countInput = screen.getByPlaceholderText('Count');
    const priceInput = screen.getByPlaceholderText('Price');
    const minCountInput = screen.getByPlaceholderText('Minimum Count');
    const addButton = screen.getByText('ADD');
  
    fireEvent.change(itemNameInput, { target: { value: 'New Item' } });
    fireEvent.change(countInput, { target: { value: '20' } });
    fireEvent.change(priceInput, { target: { value: '9.99' } });
    fireEvent.change(minCountInput, { target: { value: '10' } });
    fireEvent.click(addButton);
  
    // Expect an error message to be displayed
    const errorMessage = await waitFor(() => screen.getByText(/Error/i)); // Look for error text
    expect(errorMessage).toBeInTheDocument();
  
    // Optionally, verify axios.post was called with correct data
    expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/inventory', {
      itemName: 'New Item',
      count: '20',
      price: '9.99',
      mincount: '10',
    }, { headers: { 'Content-Type': 'application/json' } });
  });
  
  test('updates an inventory item count', async () => {
    axios.get.mockResolvedValue({ data: [{ inventid: 1, ingredientname: 'Item 1', count: 10, price: 5.99, mincount: 5 }] });
    render(<InventoryPage />);
    const items = await waitFor(() => screen.getAllByText('Item 1'));
    expect(items.length).toBeGreaterThan(0);
    const updateCategorySelect = screen.getByTestId('updateCat');
    const itemNameSelect = screen.getByTestId('updateName');
    const countInput = screen.getByPlaceholderText('New Count');
    const updateButton = screen.getByText('UPDATE');

    fireEvent.change(updateCategorySelect, { target: { value: '0' } });
    fireEvent.change(itemNameSelect, { target: { value: 'Item 1' } });
    fireEvent.change(countInput, { target: { value: '20' } });
    fireEvent.click(updateButton);

    expect(axios.patch).toHaveBeenCalledWith('http://localhost:5000/api/inventory/updateQuantity', {
      itemName: 'Item 1',
      newCount: '20',
    }, { headers: { 'Content-Type': 'application/json' } });
  });

  test('updates an inventory item price', async () => {
    axios.get.mockResolvedValue({ data: [{ inventid: 1, ingredientname: 'Item 1', count: 10, price: 5.99, mincount: 5 }] });
    render(<InventoryPage />);
    const items = await waitFor(() => screen.getAllByText('Item 1'));
    expect(items.length).toBeGreaterThan(0);
    const updateCategorySelect = screen.getByTestId('updateCat');
    const itemNameSelect = screen.getByTestId('updateName');
    const updateButton = screen.getByText('UPDATE');

    fireEvent.change(updateCategorySelect, { target: { value: '1' } });
    fireEvent.change(itemNameSelect, { target: { value: 'Item 1' } });
    const countInput = screen.getByPlaceholderText('New Price');
    fireEvent.change(countInput, { target: { value: '20' } });
    fireEvent.click(updateButton);

    expect(axios.patch).toHaveBeenCalledWith('http://localhost:5000/api/inventory/updatePrice', {
      itemName: 'Item 1',
      newPrice: '20',
    }, { headers: { 'Content-Type': 'application/json' } });
  });

  test('removes an inventory item', async () => {
    axios.get.mockResolvedValue({ data: [{ inventid: 1, ingredientname: 'Item 1', count: 10, price: 5.99, mincount: 5 }] });
    render(<InventoryPage />);
    const items = await waitFor(() => screen.getAllByText('Item 1'));
    expect(items.length).toBeGreaterThan(0);
    const itemNameSelect = screen.getByTestId('removeName');
    const removeButton = screen.getByText('REMOVE');

    fireEvent.change(itemNameSelect, { target: { value: 'Item 1' } });
    fireEvent.click(removeButton);

    const successMessage = await waitFor(() => screen.getByText('Success'));
    expect(successMessage).toBeInTheDocument();
    expect(axios.delete).toHaveBeenCalledWith('http://localhost:5000/api/inventory', {
      data: { itemName: 'Item 1' },
      headers: { 'Content-Type': 'application/json' },
    });
  });

  // Add more tests for other features, error handling, and edge cases
});