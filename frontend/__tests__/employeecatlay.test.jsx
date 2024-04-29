import React from 'react';
import { render, screen } from '@testing-library/react';
import CategoryLayout from '../src/app/(employee)/employee/[category]/layout';

jest.mock('../src/components/EmployeeNavbar', () => ({ links }) => (
  <nav>
    <ul>
      {links.map((link, index) => (
        <li key={index}>
          <a href={link.route}>{link.name}</a>
        </li>
      ))}
    </ul>
  </nav>
));

jest.mock('../src/components/transactions/TransactionContext', () => ({
  TransactionProvider: ({ children }) => children,
}));

describe('CategoryLayout', () => {
  test('renders the EmployeeNavbar component with correct links', () => {
    render(<CategoryLayout />);

    const navLinks = screen.getAllByRole('link');
    expect(navLinks).toHaveLength(7);
    expect(navLinks[0]).toHaveAttribute('href', '/employee/burgers');
    expect(navLinks[0]).toHaveTextContent('Burgers');
    expect(navLinks[1]).toHaveAttribute('href', '/employee/tenders');
    expect(navLinks[1]).toHaveTextContent('Tenders');
    expect(navLinks[2]).toHaveAttribute('href', '/employee/hotdogs');
    expect(navLinks[2]).toHaveTextContent('Hot Dogs');
    expect(navLinks[3]).toHaveAttribute('href', '/employee/fries');
    expect(navLinks[3]).toHaveTextContent('Fries');
    expect(navLinks[4]).toHaveAttribute('href', '/employee/ice-cream');
    expect(navLinks[4]).toHaveTextContent('Ice Cream');
    expect(navLinks[5]).toHaveAttribute('href', '/employee/beverages');
    expect(navLinks[5]).toHaveTextContent('Beverages');
    expect(navLinks[6]).toHaveAttribute('href', '/employee/seasonal');
    expect(navLinks[6]).toHaveTextContent('Seasonal');
  });

  test('renders the children content within the layout', () => {
    render(
      <CategoryLayout>
        <div data-testid="child-content">Hello, World!</div>
      </CategoryLayout>
    );

    const childContent = screen.getByTestId('child-content');
    expect(childContent).toBeInTheDocument();
    expect(childContent.textContent).toBe('Hello, World!');
  });

  test('applies the correct CSS classes', () => {
    render(
      <CategoryLayout>
        <div>Children Content</div>
      </CategoryLayout>
    );

    const main = screen.getByRole('main');
    expect(main).toHaveClass('flex-1');
  });
});