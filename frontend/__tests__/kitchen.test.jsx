import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import KitchenStatePage from '../src/app/(employee)/employee/manager/kitchen/page';


jest.mock('next/navigation', () => ({
    useSearchParams: jest.fn(),
  }));
describe('KitchenStatePage', () => {
    beforeEach(() => {
        // Mock the fetch function
        global.fetch = jest.fn();
      });
    
      afterEach(() => {
        // Reset the mocked fetch function after each test
        jest.resetAllMocks();
      });
    test('renders the page with no orders message', async () => {
    // Mock the fetch response with an empty array
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue([]),
    };
    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    render(<KitchenStatePage />);
    const noOrdersMessage = await screen.findByText(/No orders in kitchen right now/i);
    expect(noOrdersMessage).toBeInTheDocument();
  });

  test('renders the page with orders message and order cards', async () => {
    // Mock the fetch response with sample order data
    const sampleOrders = [
      {
        transactionid: '123',
        components: [
          { itemname: 'Burger', quantity: 1 },
          { itemname: 'Fries', quantity: 1 },
        ],
      },
      {
        transactionid: '456',
        components: [{ itemname: 'Pizza', quantity: 2 }],
      },
    ];
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(sampleOrders),
    };
    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    render(<KitchenStatePage />);

    // Wait for the orders to be fetched and rendered
    const ordersMessage = await screen.findByText(/Orders in the kitchen/i);
    expect(ordersMessage).toBeInTheDocument();

    const orderCards = await screen.findAllByRole('heading', { name: /Order #/i });
    expect(orderCards).toHaveLength(sampleOrders.length);
  });


});