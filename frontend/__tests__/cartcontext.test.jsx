// __tests__/CartContext.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { CartProvider, useCart } from '../src/components/CartContext';

// Mock the useContext hook
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}));

describe('CartProvider', () => {
  it('renders children', () => {
    render(
      <CartProvider>
        <div>Test Child</div>
      </CartProvider>
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });
});

describe('useCart', () => {
  it('returns the expected context value', () => {
    const mockContext = { isCartVisible: true, setIsCartVisible: jest.fn() };
    const useContextMock = jest.spyOn(React, 'useContext');
    useContextMock.mockReturnValue(mockContext);

    const contextValue = useCart();

    expect(contextValue).toEqual(mockContext);
    expect(useContextMock).toHaveBeenCalledWith(expect.anything());
  });
});