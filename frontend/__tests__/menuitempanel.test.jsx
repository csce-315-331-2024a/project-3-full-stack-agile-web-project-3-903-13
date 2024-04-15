import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/';
import ManagerPage, { getMenuItems, getMenuItemIngredients, getMenuItemsWithIngredients, getInventoryItems, addMenuItem, removeMenuItem, updateMenuItemPrice, updateMenuItemCat, updateMenuItemIngred } from '../src/app/(employee)/employee/manager/menu-items/page';
import fetchMock from 'jest-fetch-mock';

// Set up fetch mock before running tests
fetchMock.enableMocks();

// Mock fetch responses
fetchMock.mockResponse(JSON.stringify(
    [
        {
            "menuid": 1,
            "itemname": "Bacon Cheeseburger",
            "price": 8.29,
            "category": 0,
            "description": "Our signature Beef Patty topped with Crispy Bacon and American cheese on a Toasty Bun."
        },
        {
            "menuid": 2,
            "itemname": "Classic Hamburger",
            "price": 6.89,
            "category": 0,
            "description": "Single Beef patty topped with fresh lettuce, pickles, tomatoes, and onions."
        }
    ]
  ));
  
  fetchMock.mockResponseOnce(JSON.stringify({ 
    menuItemIngredients: [ /* mock menu item ingredients data */ ],
  }));
  
  fetchMock.mockResponseOnce(JSON.stringify({ 
    menuItemsWithIngredients: [ /* mock menu items with ingredients data */ ],
  }));
  
  fetchMock.mockResponseOnce(JSON.stringify(
    [
        {
            "inventid": 34,
            "ingredientname": "Pepsi Zero",
            "count": 2030,
            "price": 6,
            "mincount": 1015
        },
        {
            "inventid": 36,
            "ingredientname": "Diet Dr Pepper",
            "count": 1522,
            "price": 2,
            "mincount": 761
        }
    ]
  ));
  

jest.mock('react-icons/fa', () => ({
  FaTrash: () => <span data-testid="trash-icon">Trash Icon</span>,
}));

describe('ManagerPage Component', () => {
  test('renders ManagerPage component', () => {
    render(<ManagerPage />);
  });
  test('renders ManagerPage components', () => {
    const { getByText, getByLabelText } = render(<ManagerPage />);
    
    // Check if certain elements are present on the page
    expect(getByText('ADDING MENU ITEMS')).toBeInTheDocument();
    expect(getByText('UPDATE MENU ITEMS')).toBeInTheDocument();
    expect(getByText('REMOVING MENU ITEMS')).toBeInTheDocument();
    // Add more assertions for other elements as needed
  });

  

  // Add more tests for other functionalities as needed
});
