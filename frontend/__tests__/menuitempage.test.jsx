import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import ManagerPage from '../src/app/(employee)/employee/manager/menu-items/page';

jest.mock('axios');

describe('ManagerPage', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: [] });
    axios.post.mockResolvedValue({ data: { success: true, message: 'Menu item added successfully' } });
    axios.patch.mockResolvedValue({ data: { success: true, message: 'Menu item updated successfully' } });
    axios.delete.mockResolvedValue({ data: { success: true, message: 'Menu item removed successfully' } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders menu items', async () => {
    axios.get.mockResolvedValue({
      data: [{ menuid: 1, itemname: 'Test', price: 5.99, category: 0, ingredients: [{inventid: 2, ingredientname: "Buns", count: 1309, price: 4, mincount: 500, quantity: 1}] }],
    });
    render(<ManagerPage />);
    const items = await waitFor(() => screen.getAllByText('Test'));
    expect(items.length).toBeGreaterThan(1);
  });

  test('adds a new menu item', async () => {
    render(<ManagerPage />);
    const itemNameInput = screen.getByPlaceholderText('Item Name');
    const priceInput = screen.getByPlaceholderText('Price');
    const addButton = screen.getByText('ADD');

    fireEvent.change(itemNameInput, { target: { value: 'New Item' } });
    fireEvent.change(priceInput, { target: { value: '9.99' } });
    fireEvent.click(addButton);

    const successMessage = await waitFor(() => screen.getByText('Menu item added successfully'));
    expect(successMessage).toBeInTheDocument();
    expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/menuitems', {
      itemName: 'New Item',
      price: '9.99',
      category: 0,
      ingredients: [],
      isSeasonal: false,
      expirationDate: '',
    }, { headers: { 'Content-Type': 'application/json' } });
  });

  test('updates a menu item price', async () => {
    axios.get.mockResolvedValue({
        data: [{ menuid: 1, itemname: 'Test', price: 5.99, category: 0, ingredients: [] }],
      });
    render(<ManagerPage />);
    const items = await waitFor(() => screen.getAllByText('Test'));
    expect(items.length).toBeGreaterThan(0);
    const updateCategorySelect = screen.getByText('Update Price');
    const priceInput = screen.getByPlaceholderText('New Price');
    const updateButton = screen.getByText('UPDATE');
    
    fireEvent.change(updateCategorySelect, { target: { value: '0' } });
    const item = await waitFor(() => screen.getByText('Update Price'));
    expect(item).toBeInTheDocument();
    const itemNameSelect = screen.getByTestId('updateName');
    fireEvent.change(itemNameSelect, { target: { value: 'Test' } });
    fireEvent.change(priceInput, { target: { value: '7.99' } });
    fireEvent.click(updateButton);

    expect(axios.patch).toHaveBeenCalledWith('http://localhost:5000/api/menuitems/updatePrice', {
      itemName: 'Test',
      newPrice: '7.99',
    }, { headers: { 'Content-Type': 'application/json' } });
  });

  test('removes a menu item', async () => {
    axios.get.mockResolvedValue({
        data: [{ menuid: 1, itemname: 'Test', price: 5.99, category: 0, ingredients: [] }],
      });
    render(<ManagerPage />);
    const items = await waitFor(() => screen.getAllByText('Test'));
    expect(items.length).toBeGreaterThan(0);
    const itemNameSelect = screen.getByTestId('removeName');
    const removeButton = screen.getByText('REMOVE');

    fireEvent.change(itemNameSelect, { target: { value: 'Test' } });
    fireEvent.click(removeButton);

    const successMessage = await waitFor(() => screen.getByText('Menu item removed successfully'));
    expect(successMessage).toBeInTheDocument();
    expect(axios.delete).toHaveBeenCalledWith('http://localhost:5000/api/menuitems', {
      data: { itemName: 'Test' },
    });
  });

  // Add more tests for other features, error handling, and edge cases
});