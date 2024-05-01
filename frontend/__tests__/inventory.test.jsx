// InventoryPage.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InventoryPage from '../src/app/(employee)/employee/manager/inventory/page'; // Replace with the path to your InventoryPage component
import axios from 'axios';

jest.mock('axios');

describe('InventoryPage component', () => {
  test('renders inventory items on successful fetch', async () => {
    const mockData = [
      { inventid: 1, ingredientname: 'Item 1', count: 10, price: 5.99, mincount: 2 },
      { inventid: 2, ingredientname: 'Item 2', count: 5, price: 3.50, mincount: 1 },
    ];
    axios.get.mockResolvedValueOnce({ data: mockData });

    render(<InventoryPage />);

    await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for async fetch

    await waitFor(() => expect(screen.getByText('Item 1')).toBeInTheDocument());
  });

  test('shows error message on failed fetch', async () => {
    const error = new Error('Network Error');
    axios.get.mockRejectedValueOnce(error);

    render(<InventoryPage />);

    await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for async fetch

    expect(screen.getByText('Inventory Hub')).toBeInTheDocument();
  });

  test('opens add modal on button click', () => {
    render(<InventoryPage />);

    const addButton = screen.getByText('Add Inventory Item');
    fireEvent.click(addButton);

    expect(screen.getByText('ADD')).toBeInTheDocument();
  });

  test('opens update modal on button click', () => {
    render(<InventoryPage />);

    const updateButton = screen.getByText('Update Inventory Item');
    fireEvent.click(updateButton);

    expect(screen.getByText('UPDATE')).toBeInTheDocument();
  });

  test('opens remove modal on button click', () => {
    render(<InventoryPage />);

    const removeButton = screen.getByText('Remove Inventory Item');
    fireEvent.click(removeButton);

    expect(screen.getByText('REMOVE')).toBeInTheDocument();
  });
});
