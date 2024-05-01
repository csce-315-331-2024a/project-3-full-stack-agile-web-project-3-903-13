import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ExcessReportPage from '../src/app/(employee)/employee/manager/excess-report/page';

global.fetch = jest.fn();
describe('ExcessReportPage component', () => {
  beforeEach(() => {
    global.fetch.mockReset();
  });

  it('should render the component correctly', () => {
    render(<ExcessReportPage />);

    expect(screen.getByText('Excess Report')).toBeInTheDocument();
  });

  it('should update start and end date on input change', () => {
    render(<ExcessReportPage />);

    const startDateInput = screen.getByTestId('start-date-input');
    const endDateInput = screen.getByTestId('end-date-input');

    fireEvent.change(startDateInput, { target: { value: '2024-01-04' } });
    fireEvent.change(endDateInput, { target: { value: '2024-02-04' } });

    expect(screen.getByDisplayValue('2024-01-04')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-02-04')).toBeInTheDocument();
  });

  it('fetches excess report successfully', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { name: 'Item 1', totalinventoryused: '5', inventorybegin: '100' },
        { name: 'Item 2', totalinventoryused: '10', inventorybegin: '200' },
      ],
    }).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { totalinventoryused: '10' },
        { totalinventoryused: '20' },
      ],
    });

    

    render(<ExcessReportPage  />);

    const startDateInput = screen.getByTestId('start-date-input');
    const endDateInput = screen.getByTestId('end-date-input');
    const generateButton = screen.getByRole('button');

    fireEvent.change(startDateInput, { target: { value: '2024-01-04' } });
    fireEvent.change(endDateInput, { target: { value: '2024-02-04' } });

    fireEvent.click(screen.getByText('Generate Report'));

    expect(global.fetch).toHaveBeenCalledTimes(1);

    // You can add assertions here based on the expected behavior of your component
  });

 
});
