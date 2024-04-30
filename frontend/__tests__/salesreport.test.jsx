// SalesReportPage.test.jsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SalesReportPage from '../src/app/(employee)/employee/manager/sales-report/page'; // Replace with your component path

describe('SalesReportPage component', () => {
  it('renders the component initially', () => {
    render(<SalesReportPage />);

    // Check for specific elements or text content
    expect(screen.getByText('Sales Report')).toBeInTheDocument();
    expect(screen.getByText('Generate Report')).toBeInTheDocument();
  });

  it('enables the Generate Report button when both start and end dates are selected', () => {
    render(<SalesReportPage />);

    // Simulate selecting start and end dates
    const startDateInput = screen.getByTestId('start date'); // Adjust data-testid or selector as needed
    const endDateInput = screen.getByTestId('end date'); // Adjust data-testid or selector as needed
    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2024-01-31' } });

    // Check if the button is enabled
    expect(screen.getByRole('button')).toBeEnabled();
  });

  // Assuming your component fetches data and populates the table
  it('fetches data and displays an error message if no entries are found', async () => {
    global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([]),
    })
  );

    render(<SalesReportPage />);

    // Simulate selecting dates and triggering report generation
    const startDateInput = screen.getByTestId('start date'); // Adjust data-testid or selector as needed
    const endDateInput = screen.getByTestId('end date'); // Adjust data-testid or selector as needed
    const generateButton = screen.getByRole('button');
    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2024-01-31' } });
    fireEvent.click(generateButton);

    // Wait for potential data fetching and rendering (adjust timeout if needed)
    await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust timeout if needed

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  // Add a test for successful data fetching and table population (optional)
  // You might need to mock the fetch behavior or adjust expectations based on your implementation.
  it('fetches data and displays the report table with formatted total sales', async () => {
    global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
            { itemname: 'Item 1', quantity_sold: 10, total_sales: 123.45 },
            { itemname: 'Item 2', quantity_sold: 5, total_sales: 99.99 },
        ]),
    })
  );

    render(<SalesReportPage />);

    // Simulate selecting dates and triggering report generation
    const startDateInput = screen.getByTestId('start date'); // Adjust data-testid or selector as needed
    const endDateInput = screen.getByTestId('end date'); // Adjust data-testid or selector as needed
    const generateButton = screen.getByRole('button');
    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2024-01-31' } });
    fireEvent.click(generateButton);

    // Wait for potential data fetching and rendering (adjust timeout if needed)
    await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust timeout if needed

    // Verify data in the table
    const tableRows = screen.getAllByRole('row'); // Find all table rows

    // Expect two rows (header and one data row for each item)
    expect(tableRows.length).toBe(3);

    // Verify data for the first item row
    const firstItemData = tableRows[1].querySelectorAll('td'); // Get all cells in the first data row

    expect(firstItemData[0].textContent).toBe('Item 1');
    expect(firstItemData[1].textContent).toBe('10'); // Quantity
    expect(firstItemData[2].textContent).toBe('$123.45'); // Formatted total sales

    // You can add similar assertions for the second item row data (optional)
  });
});
