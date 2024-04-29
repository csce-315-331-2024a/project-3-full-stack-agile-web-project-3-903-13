import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import RestockReportPage from '../src/app/(employee)/employee/manager/restock-report/page';

// Mock axios
jest.mock('axios');

describe('RestockReportPage component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fetches restock report successfully', async () => {
    const mockRestockItems = [
      { inventid: 1, ingredientname: 'Ingredient A', count: 10, price: 5, mincount: 5 },
      { inventid: 2, ingredientname: 'Ingredient B', count: 20, price: 10, mincount: 10 }
    ];
    
    // Mock the axios.get function to return mock data
    axios.get.mockResolvedValue({ data: mockRestockItems });

    // Render the component
    const { getByText, queryByText } = render(<RestockReportPage />);
    
    // Check if loading message is displayed
    expect(getByText('Loading...')).toBeInTheDocument();
    
    // Wait for data to be loaded
    await waitFor(() => {
      fireEvent.click(getByText('Regenerate Report'));
    });

    // Check if data is displayed
    expect(queryByText('Ingredient A')).toBeInTheDocument();
    expect(queryByText('Ingredient B')).toBeInTheDocument();
    
    // Check if loading message disappears
    expect(queryByText('Loading...')).toBeNull();
  });

  test('fulfills restock successfully', async () => {
    // Mock axios.patch function
    axios.patch.mockResolvedValue({ data: 'Restock fulfilled successfully' });

    // Mock console.log
    const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

    // Render the component
    const { getByText } = render(<RestockReportPage />);

    // Trigger fulfill restock button click
    fireEvent.click(getByText('Fulfill Restock'));

    // Check if restock fulfillment message is logged
    await waitFor(() => {
      expect(mockConsoleLog).toHaveBeenCalledWith('Restock fulfilled successfully:', 'Restock fulfilled successfully');
    });

    // Restore console.log
    mockConsoleLog.mockRestore();
  });
});
