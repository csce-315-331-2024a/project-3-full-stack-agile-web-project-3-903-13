// MenuBoard.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import axios from 'axios'; // Mock axios for testing
import HomePage from '@/app/menu_board/Board_2/page';

jest.mock('axios'); // Mock axios for controlled responses

const MockMenuData = [
  {
    id: 1,
    itemname: "Cheeseburger",
    description: "A classic cheeseburger with...",
    category: 1,
    price: 10.99,
  },
  {
    id: 2,
    itemname: "Fries",
    description: "Crispy golden fries...",
    category: 2,
  },
];


describe('MenuBoard component', () => {
  test('renders loading message while fetching data', async () => {
    axios.get.mockResolvedValueOnce({ data: [] }); // Mock empty response
    render(<HomePage />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });


  test('renders menu items after successful fetch', async () => {
    axios.get.mockResolvedValueOnce({ data: MockMenuData }); // Mock successful response
    render(<HomePage />);

    // Wait for async data fetching
    await new Promise((resolve) => setTimeout(resolve, 0));

    const menuItems = screen.getAllByText(MockMenuData[0].itemname);
    expect(menuItems.length).toBeGreaterThan(0);
  });

  test('groups menu items by category', async () => {
    axios.get.mockResolvedValueOnce({ data: MockMenuData }); // Mock successful response
    render(<HomePage />);

    await new Promise((resolve) => setTimeout(resolve, 0));

    const hotDogsCategory = screen.getByText('HotDogs/Corndogs');
    expect(hotDogsCategory).toBeInTheDocument();
  });
});
