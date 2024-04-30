import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OrderManagementPage from '../src/app/(employee)/employee/manager/order-management/page';

describe('OrderManagementPage', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([]),
    });
  });

  it('renders without crashing', () => {
    render(<OrderManagementPage />);
  });

  it('renders the correct heading', () => {
    render(<OrderManagementPage />);
    const heading = screen.getByRole('heading', { name: /Order Management/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders the option select', () => {
    render(<OrderManagementPage />);
    const optionSelect = screen.getByTestId('option-select');
    expect(optionSelect).toBeInTheDocument();
  });

  it('renders the order ID input when "By Order ID" option is selected', () => {
    render(<OrderManagementPage />);
    const orderIdInput = screen.getByTestId('order-id-input');
    expect(orderIdInput).toBeInTheDocument();
  });

  it('renders the start date and end date inputs when "By Period" option is selected', () => {
    render(<OrderManagementPage />);
    const optionSelect = screen.getByTestId('option-select');
    fireEvent.change(optionSelect, { target: { value: 'duration' } });

    const startDateInput = screen.getByTestId('start-date');
    const endDateInput = screen.getByTestId('end-date');
    expect(startDateInput).toBeInTheDocument();
    expect(endDateInput).toBeInTheDocument();
  });

  it('displays an error message when start date is after end date', async () => {
    render(<OrderManagementPage />);
    const optionSelect = screen.getByTestId('option-select');
    fireEvent.change(optionSelect, { target: { value: 'duration' } });

    const startDateInput = screen.getByTestId('start-date');
    const endDateInput = screen.getByTestId('end-date');
    fireEvent.change(startDateInput, { target: { value: '2023-05-15' } });
    fireEvent.change(endDateInput, { target: { value: '2023-05-10' } });

    const submitButton = screen.getByText("Find");
    fireEvent.click(submitButton);

    const errorMessage = await screen.findByText(/Start date can not be after end date/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('fetches data when the form is submitted', async () => {
    render(<OrderManagementPage />);
    const orderIdInput = screen.getByTestId('order-id-input');
    fireEvent.change(orderIdInput, { target: { value: '123' } });

    const submitButton = screen.getByText("Find");
    fireEvent.click(submitButton);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
  });

});