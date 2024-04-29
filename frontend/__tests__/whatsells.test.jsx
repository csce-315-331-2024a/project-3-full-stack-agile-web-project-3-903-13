import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import SalesReportPage from '../src/app/(employee)/employee/manager/what-sells-together/page';

// Mock fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([
      { m1name: 'Item A', m2name: 'Item B', paircount: 10 },
      { m1name: 'Item C', m2name: 'Item D', paircount: 20 }
    ]),
  })
);

describe('SalesReportPage component', () => {
  test('fetches sales report successfully', async () => {
    const { getByText, getByLabelText } = render(<SalesReportPage />);

    // Fill out form inputs
    const startDateInput = screen.getByTestId('start date'); // Adjust data-testid or selector as needed
    const endDateInput = screen.getByTestId('end date'); // Adjust data-testid or selector as needed
    const generateButton = screen.getByText('Generate Report');
    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2024-01-31' } });
    fireEvent.click(generateButton);

    // Check loading message
    expect(getByText('Loading...')).toBeInTheDocument();

    // Wait for data to be loaded
    await waitFor(() => expect(getByText('Item A')).toBeInTheDocument());

    // Check if data is displayed
    expect(getByText('Item B')).toBeInTheDocument();
    expect(getByText('Item C')).toBeInTheDocument();
    expect(getByText('Item D')).toBeInTheDocument();

    // Check if success message is displayed
    expect(getByText('What Sells Together Report generated successfully')).toBeInTheDocument();
  });

  test('handles failed sales report fetch', async () => {
    // Mock fetch function to simulate failure
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
      })
    );

    const { getByText, getByLabelText } = render(<SalesReportPage />);

    const startDateInput = screen.getByTestId('start date'); // Adjust data-testid or selector as needed
    const endDateInput = screen.getByTestId('end date'); // Adjust data-testid or selector as needed
    const generateButton = screen.getByText('Generate Report');
    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2024-01-31' } });
    fireEvent.click(generateButton);

    // Check loading message
    expect(getByText('Loading...')).toBeInTheDocument();

    // Wait for error message
    await waitFor(() => expect(getByText('Failed to fetch sales report. Please try again.')).toBeInTheDocument());
  });
});
