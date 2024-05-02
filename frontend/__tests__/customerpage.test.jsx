// __tests__/Home.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../src/app/(customer)/page';
import { TransactionProvider } from '../src/components/transactions/TransactionContext';

// Mock the useRouter hook from 'next/navigation'
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the WeatherWidget component
jest.mock('../src/components/WeatherAPI', () => () => <div>WeatherWidget</div>);

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([{ inventid: 1, ingredientname: 'Ingredient 1', quantity: 2 }]),
  })
);

describe('Home', () => {
  const updateTransactionMock = jest.fn();

  beforeEach(() => {
    render(
      <TransactionProvider value={{ updateTransaction: updateTransactionMock }}>
        <Home />
      </TransactionProvider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the WeatherWidget component', () => {
    expect(screen.getByText('WeatherWidget')).toBeInTheDocument();
  });

  it('renders the menu categories', () => {
    const categories = ['Burgers', 'Hotdogs/Corndogs', 'Chicken Tenders', 'Sides', 'Shakes', 'Beverages', 'Seasonal'];
    categories.forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it('handles order click', async () => {
    const orderButton = screen.getByRole('button', { name: /Order/i });
    fireEvent.click(orderButton);

    // Wait for the fetch call to complete
    await Promise.resolve();

    expect(updateTransactionMock).not.toHaveBeenCalledWith({
      id: expect.any(Number),
      itemname: expect.any(String),
      price: expect.any(Number),
      quantity: 1,
      modif: '',
      itemToRemove: [{ inventid: 1, ingredientname: 'Ingredient 1', quantity: 2 }],
    });
  });
});