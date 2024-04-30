// NutritionPage.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios'; // Mock is needed for axios.get
import NutritionPage from '@/app/(customer)/nutrition/page';

jest.mock('axios'); // Mock axios to avoid actual network calls

const mockData = [
  {
    menuid: 1,
    itemname: "Vegetarian Burger",
    Calories: 500,
    specialdiet: 1, // Vegetarian
    allergy: 0, // Gluten Free
  },
  {
    menuid: 2,
    itemname: "Fish and Chips",
    Calories: 700,
    specialdiet: 2, // Pescatarian
    allergy: 1, // Not Gluten Free
  },
];

test('renders NutritionPage with menu items', async () => {
  axios.get.mockResolvedValueOnce({ data: mockData }); // Mock successful axios call

  render(<NutritionPage />);

  // Wait for async data fetching to complete
  await waitFor(() => {
    const title = screen.getByText(/Allergens & Special Diets/i);
    const menuItem1 = screen.getByText(/Vegetarian Burger/i);
    const menuItem2 = screen.getByText(/Fish and Chips/i);

    expect(title).toBeInTheDocument();
    expect(menuItem1).toBeInTheDocument();
    expect(menuItem2).toBeInTheDocument();
  });
});


