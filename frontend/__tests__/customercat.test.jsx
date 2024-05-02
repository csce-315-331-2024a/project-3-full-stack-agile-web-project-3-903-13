// jest.test.js
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import Page, { getMenuItemSeasonal } from '../src/app/(customer)/[category]/page';

// Mock the TransactionContext
jest.mock('../src/components/transactions/TransactionContext', () => ({
    useTransaction: jest.fn(() => ({
        updateTransaction: jest.fn(),
        transactions: [],
      })),
      TransactionProvider: ({ children }) => children,
}));

// Mock the toast import
jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
}));

// Mock the UpdateModal component
jest.mock('../src/components/updateItems/customerView', () => () => <div>UpdateModal</div>);

// Mock the axios library
jest.mock('axios');

describe('Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component correctly', async () => {
    const mockData = [
      { menuid: 1, itemname: 'Burger', price: 5.99, category: 0 },
      { menuid: 2, itemname: 'Hot Dog', price: 3.99, category: 1 },
    ];
    axios.get.mockResolvedValueOnce({ data: mockData });
    axios.get.mockResolvedValueOnce({ data: [{ expirationdate: new Date().toISOString() }] });

    render(<Page params={{ category: 'Burgers' }} />);

    await waitFor(() => {
      expect(screen.getByText('Burgers')).toBeInTheDocument();
    });
  });


});

describe('getMenuItemSeasonal', () => {
  it('fetches seasonal data correctly', async () => {
    const mockItem = { itemName: 'Burger' };
    const mockData = [{ expirationdate: new Date().toISOString() }];
    axios.get.mockResolvedValueOnce({ data: mockData });

    const result = await getMenuItemSeasonal(mockItem);
    expect(result).toEqual(mockData);
  });

  it('handles error when fetching seasonal data', async () => {
    const mockItem = { itemName: 'Burger' };
    const mockError = new Error('Network Error');
    axios.get.mockRejectedValueOnce(mockError);

    await expect(getMenuItemSeasonal(mockItem)).rejects.toThrow(mockError);
  });
});