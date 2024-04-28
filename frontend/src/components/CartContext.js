"use client";

import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [isCartVisible, setIsCartVisible] = useState(false);

  return (
    <CartContext.Provider value={{ isCartVisible, setIsCartVisible }} aria-hidden={!isCartVisible}>
      {children}
    </CartContext.Provider>
  );
};
