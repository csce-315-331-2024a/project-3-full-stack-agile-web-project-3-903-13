// MenuBoard.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import axios from 'axios'; // Mock axios for testing
import HomePage from '@/app/menu_board/Board_3/page';

jest.mock('axios'); // Mock axios for controlled responses

const MockMenuData = [
  {
    id: 1,
    itemname: "Cheeseburger",
    description: "A classic cheeseburger with...",
    category: 3, // Category "Sides"
    price: 10.99,
  },
  {
    id: 2,
    itemname: "Chocolate Shake",
    description: "A rich and creamy chocolate...",
    category: 4, // Category "Shakes"
    price: 5.99,
  },
];

describe('MenuBoard component', () => {
  // Test loading message
  test('renders loading message while fetching data', async () => {
    axios.get.mockResolvedValueOnce({ data: [] }); // Mock empty response
    render(<HomePage />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  // Test menu rendering after successful fetch
  test('renders menu items after successful fetch', async () => {
    axios.get.mockResolvedValueOnce({ data: MockMenuData }); // Mock successful response
    render(<HomePage />);

    // Wait for async data fetching
    await new Promise((resolve) => setTimeout(resolve, 0));

    const menuItems = screen.getAllByText(/Cheeseburger|Chocolate Shake/);
    expect(menuItems.length).toBeGreaterThan(0);
  });

  // Test category rendering
  test('renders menu items grouped by category', async () => {
    axios.get.mockResolvedValueOnce({ data: MockMenuData }); // Mock successful response
    render(<HomePage />);

    await new Promise((resolve) => setTimeout(resolve, 0));

    const sidesCategory = screen.getByText('Sides');
    const shakesCategory = screen.getByText('Shakes');
    expect(sidesCategory).toBeInTheDocument();
    expect(shakesCategory).toBeInTheDocument();
  });

  // Test image rendering
  test('renders image for each menu item', async () => {
    axios.get.mockResolvedValueOnce({ data: MockMenuData }); // Mock successful response
    render(<HomePage />);

    await new Promise((resolve) => setTimeout(resolve, 0));

    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0); // Expect at least one image
  });
});
