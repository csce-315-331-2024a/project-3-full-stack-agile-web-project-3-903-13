// OrderManagementPage.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OrderManagementPage from '../src/app/(employee)/employee/manager/order-management/page';

describe('OrderManagementPage', () => {
  test('renders the page', () => {
    render(<OrderManagementPage />);
    const heading = screen.getByRole('heading', { name: /Order Management/i });
    expect(heading).toBeInTheDocument();
  });

  test('select option changes the input fields', () => {
    render(<OrderManagementPage />);
    const optionSelect = screen.getByTestId('option-select');
    const orderIdInput = screen.getByTestId('order-id-input');
    const startDateInput = screen.queryByTestId('start-date');
    const endDateInput = screen.queryByTestId('end-date');
  
    // Check initial state
    expect(orderIdInput).toBeVisible();
    expect(startDateInput).not.toBeInTheDocument();
    expect(endDateInput).not.toBeInTheDocument();
  
    // Change option to "duration"
    fireEvent.change(optionSelect, { target: { value: 'duration' } });
  
    // Check updated state after changing the option
    expect(orderIdInput).toBeVisible(); // Assuming it remains visible
    expect(screen.getByTestId('start-date')).toBeVisible();
    expect(screen.getByTestId('end-date')).toBeVisible();
  
    // Change option back to "transactionID"
    fireEvent.change(optionSelect, { target: { value: 'transactionID' } });
  
    // Check updated state after changing the option back
    expect(orderIdInput).toBeVisible();
    expect(screen.queryByTestId('start-date')).not.toBeInTheDocument();
    expect(screen.queryByTestId('end-date')).not.toBeInTheDocument();
  });

  test('fetches and displays transactions by ID', async () => {
    // Mock the fetch function
    const mockFetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({
        transactionid: '123',
        cost: 10.99,
        transactiontime: '2023-04-21T12:34:56Z',
      }),
    });
    global.fetch = mockFetch;

    render(<OrderManagementPage />);
    const orderIdInput = screen.getByTestId('order-id-input');
    const findButton = screen.getByRole('button', { name: /Find/i });

    // Enter order ID and submit the form
    fireEvent.change(orderIdInput, { target: { value: '123' } });
    fireEvent.click(findButton);

    // Wait for the transaction data to be rendered
    await waitFor(() => {
      const transactionElement = screen.getByText(/Order #123/i);
      expect(transactionElement).toBeVisible();
    });
  });

  // Add more tests as needed
});