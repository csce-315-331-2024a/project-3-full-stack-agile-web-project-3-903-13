import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import ManagerPage from "../src/app/(employee)/employee/manager/menu-items/page";
import fetchMock from 'jest-fetch-mock';

// Mocking fetch globally
global.fetch = fetchMock;

describe('ManagerPage component', () => {
  beforeEach(() => {
    fetchMock.mockClear(); // Clear fetch mock calls before each test
  });

  test('Menu items are fetched on mount', async () => {
    // Mock successful response for menu items
    fetchMock.mockResponseOnce(JSON.stringify([]));

    render(<ManagerPage />);
    
    // Wait for the fetch to be called and resolve
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('http://localhost:5000/api/menuitems'));
  });

  test('Inventory items are fetched on mount', async () => {
    // Mock successful response for inventory items
    fetchMock.mockResponseOnce(JSON.stringify([]));

    render(<ManagerPage />);
    
    // Wait for the fetch to be called and resolve
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('http://localhost:5000/api/inventory'));
  });

  test('State variables are initialized correctly', () => {
    render(<ManagerPage />);
    
    // Check if elements with data-testid are rendered with correct initial values
    expect(screen.getByTestId('addItemName')).toHaveValue('');
    expect(screen.getByTestId('addPrice')).toHaveValue('');
    expect(screen.getByTestId('addItemCategory')).toHaveValue('0');
    // Add similar expectations for other state variables
  });
});
