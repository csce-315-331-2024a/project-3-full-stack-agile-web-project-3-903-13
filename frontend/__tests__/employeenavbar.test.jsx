import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import EmployeeNavbar from '../src/components/EmployeeNavbar';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('../src/components/GoogleTranslate', () => () => <div>Google Translate Widget</div>);

describe('EmployeeNavbar', () => {
  const mockLinks = [
    { name: 'Home', route: '/employee/burgers' },
    { name: 'Inventory', route: '/employee/manager/inventory' },
  ];

  beforeEach(() => {
    usePathname.mockReturnValue('/employee/burgers');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the Google Translate Widget', () => {
    render(<EmployeeNavbar links={mockLinks} />);
    const translationWidget = screen.getByText('Google Translate Widget');
    expect(translationWidget).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    render(<EmployeeNavbar links={mockLinks} />);
    const homeLink = screen.getByText('Home');
    const inventoryLink = screen.getByText('Inventory');

    expect(homeLink).toBeInTheDocument();
    expect(inventoryLink).toBeInTheDocument();
    expect(homeLink).toHaveClass('nav-link-active');
    expect(inventoryLink).toHaveClass('nav-link');
  });

 
});