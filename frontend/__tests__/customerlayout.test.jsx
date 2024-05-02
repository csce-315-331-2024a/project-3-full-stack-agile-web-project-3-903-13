// __tests__/RootLayout.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import RootLayout from '../src/app/(customer)/layout';

// Mock the next/font/google import
jest.mock('next/font/google', () => ({
  Inter: jest.fn().mockReturnValue({ className: 'inter' }),
}));

// Mock the CustomerNavbar component
jest.mock('../src/components/CustomerNavbar', () => () => <div>CustomerNavbar</div>);

// Mock the CustomerFooter component
jest.mock('../src/components/Footer', () => () => <div>CustomerFooter</div>);

// Mock the TransactionContext and CartContext providers
jest.mock('../src/components/transactions/TransactionContext', () => ({
  TransactionProvider: ({ children }) => <div>{children}</div>,
}));
jest.mock('../src/components/CartContext', () => ({
  CartProvider: ({ children }) => <div>{children}</div>,
}));

describe('RootLayout', () => {
  it('renders the layout correctly', () => {
    render(<RootLayout>Child Components</RootLayout>);

    // Check if the CustomerNavbar component is rendered
    expect(screen.getByText('CustomerNavbar')).toBeInTheDocument();

    // Check if the CustomerFooter component is rendered
    expect(screen.getByText('CustomerFooter')).toBeInTheDocument();

    // Check if the child components are rendered
    expect(screen.getByText('Child Components')).toBeInTheDocument();
  });

});