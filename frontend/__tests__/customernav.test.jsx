// CustomerNavbar.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomerNavbar from '../src/components/CustomerNavbar';
import { TransactionProvider } from '../src/components/transactions/TransactionContext';

const links = [
  { name: 'Home', route: '/' },
  { name: 'Menu', route: '/menu' },
  { name: 'About', route: '/about' },
];

describe('CustomerNavbar', () => {
  test('renders navbar links correctly', () => {
    render(
      <TransactionProvider>
        <CustomerNavbar links={links} />
      </TransactionProvider>
    );

    const homeLink = screen.getByText('Home');
    const menuLink = screen.getByText('Menu');
    const aboutLink = screen.getByText('About');

    expect(homeLink).toBeInTheDocument();
    expect(menuLink).toBeInTheDocument();
    expect(aboutLink).toBeInTheDocument();
  });

  test('toggles cart on click', () => {
    render(
      <TransactionProvider>
        <CustomerNavbar links={links} />
      </TransactionProvider>
    );

    const cartIcon = screen.getByAltText('cart');
    fireEvent.click(cartIcon);

    const cartContainer = screen.getAllByText('$0.00');
    expect(cartContainer.length).toBeGreaterThan(0);

  });

  

  // Add more tests for other functionalities...
});