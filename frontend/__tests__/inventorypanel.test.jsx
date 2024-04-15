import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/';
import fetchMock from 'jest-fetch-mock';
import InventoryPage, { getInventoryItems, updateInventCount, updateInventPrice, updateInventMin, addInventoryItem, removeInventoryItem } from '../src/app/(employee)/employee/manager/inventory/page';

// Set up fetch mock before running tests
fetchMock.enableMocks();

// Mock fetch responses
fetchMock.mockResponse(JSON.stringify([{ ingredientname: 'Item 1', count: 10, price: 5.99, mincount: 5 }]));

describe('InventoryPage Component', () => {
  test('renders InventoryPage component', () => {
    render(<InventoryPage />);
  });

  // Add more tests for other functionalities as needed
});
