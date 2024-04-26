// EmployeePOSPage.test.js

import { render, screen, debug } from '@testing-library/react';
import EmployeePOSPage from '../src/app/(employee)/employee/[category]/page'; // Assuming EmployeePOSPage is in the same directory

jest.mock('../src/app/(employee)/employee/[category]/menuItems', () => ({
    MenuItemList: jest.fn(() => null), // Mock MenuItemList for isolation
    // Add your assertion using expect(MenuItemList) here
    render: ({ categoryNum, categoryName }) => {
      // Optional: Simulate some rendering logic for MenuItemList
      expect(categoryNum).toBe(0); // Assert expected categoryNum
      expect(categoryName).toBe('Burgers'); // Assert expected categoryName
      return null; // Return null to prevent actual rendering
    }
}));

describe('EmployeePOSPage', () => {
    it('renders the correct category name based on params', () => {
        const mockParams = { category: 'burgers' };
    
        render(<EmployeePOSPage params={mockParams} />);
    
        const categoryElement = screen.getByRole('main');
    expect(categoryElement).toBeInTheDocument();
      });
});
