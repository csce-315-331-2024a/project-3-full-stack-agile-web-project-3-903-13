// ManagerLayout.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import ManagerLayout from '../src/app/(employee)/employee/manager/layout';


jest.mock('../src/components/EmployeeNavbar', () => ({
    __esModule: true,
    default: jest.fn(() => (
      // Mock rendering of EmployeeNavbar
      <div>Mocked EmployeeNavbar</div>
    )),
  }));

describe('ManagerLayout Component', () => {

  it('renders main content area with appropriate class', () => {
    render(<ManagerLayout />);

    // Find main element
    const mainContent = screen.getByRole('main');

    // Assert class and aria-label
    expect(mainContent).toHaveClass('flex-1');
    expect(mainContent).toHaveAttribute('aria-label', 'Manager Content');
  });

  it('renders children components within the main content area', () => {
    const children = <p>This is some child content.</p>;

    render(<ManagerLayout children={children} />);

    // Find child element
    const childContent = screen.getByText(/This is some child content./i);

    // Assert child content is rendered
    expect(childContent).toBeInTheDocument();
  });
});
