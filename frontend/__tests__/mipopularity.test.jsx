// ItemPopularityPage.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ItemPopularityPage from '../src/app/(employee)/employee/manager/menu-item-popularity/page'; // Replace with your component path

jest.mock('chart.js/auto'); // Mock the Chart.js library

describe('ItemPopularityPage component', () => {
  it('renders the component initially', () => {
    render(<ItemPopularityPage />);

    // Check for specific elements or text content
    expect(screen.getByText('Menu Item Popularity')).toBeInTheDocument();
    expect(screen.getByText('No sales data found for the selected date range. Try another time period.')).toBeInTheDocument();
  });

  it('enables the Generate Report button when both start and end dates are selected', () => {
    render(<ItemPopularityPage />);

    // Simulate selecting start and end dates
    const startDateInput = screen.getByTestId('start date'); // Adjust data-testid or selector as needed
    const endDateInput = screen.getByTestId('end date'); // Adjust data-testid or selector as needed
    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2024-01-31' } });

    // Check if the button is enabled
    expect(screen.getByRole('button')).toBeEnabled();
  });

  // Assuming your component fetches data and populates the chart
  it('fetches data and displays an error message if no entries are found', async () => {
    global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([]),
    })
  );

    render(<ItemPopularityPage />);

    // Simulate selecting dates and triggering report generation
    const startDateInput = screen.getByTestId('start date'); // Adjust data-testid or selector as needed
    const endDateInput = screen.getByTestId('end date'); // Adjust data-testid or selector as needed
    const generateButton = screen.getByRole('button');
    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2024-01-31' } });
    fireEvent.click(generateButton);

    // Wait for potential data fetching and rendering
    await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust timeout if needed

    expect(screen.getByText('No sales data found for the selected date range. Try another time period.')).toBeInTheDocument();
  });

  it('fetches data and displays an error message if no entries are found', async () => {
    global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([]),
    })
  );

    render(<ItemPopularityPage />);

    // Simulate selecting dates and triggering report generation
    const startDateInput = screen.getByTestId('start date'); // Adjust data-testid or selector as needed
    const endDateInput = screen.getByTestId('end date'); // Adjust data-testid or selector as needed
    const generateButton = screen.getByRole('button');
    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2024-01-31' } });
    fireEvent.click(generateButton);

    // Wait for potential data fetching and rendering
    await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust timeout if needed

    expect(screen.getByText('No sales data found for the selected date range. Try another time period.')).toBeInTheDocument();
  });

  it('fetches data and renders the chart with item names and quantities', async () => {
    global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
            { itemname: 'Item 1', quantity_sold: 20 },
            { itemname: 'Item 2', quantity_sold: 15 },
        ]),
    })
  );
  
    render(<ItemPopularityPage />);
  
    // Simulate selecting dates and triggering report generation
    const startDateInput = screen.getByTestId('start date'); // Adjust data-testid or selector as needed
    const endDateInput = screen.getByTestId('end date'); // Adjust data-testid or selector as needed
    const generateButton = screen.getByRole('button');
    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2024-01-31' } });
    fireEvent.click(generateButton);
  
    // Wait for potential data fetching and rendering (adjust timeout if needed)
    await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust timeout if needed
  
  
    await waitFor(() => expect(screen.getByTestId('chart-container')).toBeInTheDocument()); // Replace 'chart-container' with your actual class name
  });
  // Add a test for successful data fetching and chart rendering (optional)
  // You might need to mock the Chart.js library behavior or adjust expectations based on your implementation.
  // it('fetches data and renders the chart with item names and quantities', async () => {
  //   // ... Mock data fetching and chart rendering behavior
  // });
});

