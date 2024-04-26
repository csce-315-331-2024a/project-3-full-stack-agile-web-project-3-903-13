import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InventoryPage from '../src/app/(employee)/employee/manager/inventory/page';

describe('InventoryPage', () => {
  const mockInventoryItems = [
    { inventid: 1, ingredientname: 'Item 1', count: 10, price: 5.99, mincount: 5 },
    { inventid: 2, ingredientname: 'Item 2', count: 20, price: 3.99, mincount: 10 },
  ];

  it('renders inventory items', () => {
    render(<InventoryPage />);
    const itemElements = screen.getAllByRole('article');
    expect(itemElements).toHaveLength(mockInventoryItems.length);
  });

  it('renders input fields for adding an inventory item', () => {
    render(<InventoryPage />);
    const addItemNameInput = screen.getByPlaceholderText('Item Name');
    const addCountInput = screen.getByPlaceholderText('Count');
    const addPriceInput = screen.getByPlaceholderText('Price');
    const addMinCountInput = screen.getByPlaceholderText('Minimum Count');
    const addButton = screen.getByRole('button', { name: 'ADD' });

    expect(addItemNameInput).toBeInTheDocument();
    expect(addCountInput).toBeInTheDocument();
    expect(addPriceInput).toBeInTheDocument();
    expect(addMinCountInput).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
  });

  it('renders input fields and dropdowns for updating an inventory item', () => {
    render(<InventoryPage />);
    const updateCategorySelect = screen.getByTestId('updateCat');
    const itemNameSelect = screen.getByTestId('updateName');
    const updateCountInput = screen.queryByPlaceholderText('New Count');
    const updatePriceInput = screen.queryByPlaceholderText('New Price');
    const updateMinCountInput = screen.queryByPlaceholderText('New Minimum Count');
    const updateButton = screen.getByRole('button', { name: 'UPDATE' });

    expect(updateCategorySelect).toBeInTheDocument();
    expect(itemNameSelect).toBeInTheDocument();
    expect(updateCountInput || updatePriceInput || updateMinCountInput).toBeTruthy();
    expect(updateButton).toBeInTheDocument();
  });

  it('renders dropdown for removing an inventory item', () => {
    render(<InventoryPage />);
    const itemNameSelect = screen.getByTestId('removeName');
    const removeButton = screen.getByRole('button', { name: 'REMOVE' });

    expect(itemNameSelect).toBeInTheDocument();
    expect(removeButton).toBeInTheDocument();
  });

  it('handles input changes for adding an inventory item', () => {
    render(<InventoryPage />);
    const addItemNameInput = screen.getByPlaceholderText('Item Name');
    const addCountInput = screen.getByPlaceholderText('Count');
    const addPriceInput = screen.getByPlaceholderText('Price');
    const addMinCountInput = screen.getByPlaceholderText('Minimum Count');

    fireEvent.change(addItemNameInput, { target: { value: 'New Item' } });
    fireEvent.change(addCountInput, { target: { value: '30' } });
    fireEvent.change(addPriceInput, { target: { value: '7.99' } });
    fireEvent.change(addMinCountInput, { target: { value: '15' } });

    expect(addItemNameInput).toHaveValue('New Item');
    expect(addCountInput).toHaveValue(30);
    expect(addPriceInput).toHaveValue(7.99);
    expect(addMinCountInput).toHaveValue(15);
  });

  it('handles dropdown changes for updating an inventory item', () => {
    render(<InventoryPage />);
    const updateCategorySelect = screen.getByTestId('updateCat');
    const itemNameSelect = screen.getByTestId('updateName');

    fireEvent.change(updateCategorySelect, { target: { value: '1' } });
    fireEvent.change(itemNameSelect, { target: { value: mockInventoryItems[0].ingredientname } });

    expect(updateCategorySelect).toHaveValue('1');
    expect(itemNameSelect).toHaveValue(mockInventoryItems[0].ingredientname);
  });

  it('handles dropdown change for removing an inventory item', () => {
    render(<InventoryPage />);
    const itemNameSelect = screen.getByTestId('removeName');

    fireEvent.change(itemNameSelect, { target: { value: mockInventoryItems[0].ingredientname } });

    expect(itemNameSelect).toHaveValue(mockInventoryItems[0].ingredientname);
  });
});