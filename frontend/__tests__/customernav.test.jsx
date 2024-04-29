import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { useTransaction } from '../src/components/transactions/TransactionContext';
import CustomerNavbar from '../src/components/CustomerNavbar';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('../src/components/transactions/TransactionContext', () => ({
  useTransaction: jest.fn(),
}));

jest.mock('../src/components/GoogleTranslate', () => () => <div>Google Translate Widget</div>);

describe('CustomerNavbar', () => {
  const mockLinks = [
    { name: 'Home', route: '/' },
    { name: 'Menu Board', route: '/menu_board' },
    { name: 'Employee', links: [{ name: 'Burgers', route: '/employee/burgers' }] },
  ];

  const mockTransactions = [
    { id: 1, itemname: 'Burger', price: 5, quantity: 2 },
    { id: 2, itemname: 'Fries', price: 3, quantity: 1 },
  ];

  beforeEach(() => {
    usePathname.mockReturnValue('/');
    useTransaction.mockReturnValue({
      transactions: mockTransactions,
      clearTransaction: jest.fn(),
      submitTransaction: jest.fn(),
      updateTransaction: jest.fn(),
      removeItemFromTransaction: jest.fn(),
      removeItemCompletely: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the Google Translate Widget', () => {
    render(<CustomerNavbar links={mockLinks} />);
    const translationWidget = screen.getByText('Google Translate Widget');
    expect(translationWidget).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    render(<CustomerNavbar links={mockLinks} />);
    const homeLink = screen.getByText('Home');
    const menuBoardLink = screen.getByText('Menu Board');
    const employeeLink = screen.getByText('Employee');

    expect(homeLink).toBeInTheDocument();
    expect(menuBoardLink).toBeInTheDocument();
    expect(employeeLink).toBeInTheDocument();
  });



 


  
  // Add more tests for other functionalities as needed
});