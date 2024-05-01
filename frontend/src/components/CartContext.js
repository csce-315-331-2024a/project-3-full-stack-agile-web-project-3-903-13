"use client";

import React, { createContext, useContext, useState } from 'react';

/**
 * Provides a React context for managing the visibility of the shopping cart across the application.
 * This context allows components nested within the `CartProvider` to access and modify the cart's visibility state.
 *
 * @module CartContext
 */
const CartContext = createContext();

/**
 * Custom hook for accessing the cart's context.
 * This hook simplifies the process of using cart-related data and functions from the CartContext.
 * 
 * @function useCart
 * @returns {Object} The context value that includes the state and updater function for the cart's visibility.
 */
export const useCart = () => useContext(CartContext);

/**
 * Component that provides the cart context to its child components.
 * It initializes the state for whether the cart is visible and provides a context provider to manage this state.
 * The `CartProvider` should wrap parts of the application that need access to and control over the cart's visibility.
 *
 * @function CartProvider
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The child components that will have access to the cart context.
 * @returns {React.Component} A context provider component that passes down cart state to its children.
 */
export const CartProvider = ({ children }) => {
  const [isCartVisible, setIsCartVisible] = useState(false);

  return (
    <CartContext.Provider value={{ isCartVisible, setIsCartVisible }} aria-hidden={!isCartVisible}>
      {children}
    </CartContext.Provider>
  );
};
