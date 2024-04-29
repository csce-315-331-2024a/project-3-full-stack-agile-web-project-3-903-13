import React from 'react';
import { render, screen } from '@testing-library/react';
import EmployeeLayout from '../src/app/(employee)/layout';

jest.mock('../src/components/EmployeeNavbar', () => () => <div>Employee Navbar</div>);
jest.mock('../src/components/LeftSidebar', () => () => <div>Left Sidebar</div>);

describe('EmployeeLayout', () => {

  test('renders the children content within the layout', () => {
    render(
      <EmployeeLayout>
        <div data-testid="child-content">Hello, World!</div>
      </EmployeeLayout>
    );

    const childContent = screen.getByTestId('child-content');
    expect(childContent).toBeInTheDocument();
    expect(childContent.textContent).toBe('Hello, World!');
  });

  
});