// Import necessary components and functions
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UsersPage from '../src/app/(employee)/employee/manager/users/page'; // Assuming UsersPage is the export name
import axios from 'axios'; // Assuming axios is mocked or stubbed

jest.mock('axios'); // Mock axios for controlled behavior

describe('UsersPage component', () => {
  // Mock successful employee data fetching
  const mockEmployees = [
    {
      employeename: 'John Doe',
      email: 'john.doe@example.com',
      employeephonenumber: '123-456-7890',
      employeeage: 30,
      employeehours: 40,
      role: 'Manager',
    },
    {
      employeename: 'Jane Smith',
      email: 'jane.smith@example.com',
      employeephonenumber: '987-654-3210',
      employeeage: 25,
      employeehours: 35,
      role: 'Developer',
    },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValueOnce({ data: mockEmployees }); // Mock successful response
  });

  test('renders the UsersPage component with employee data', async () => {
    render(<UsersPage />);
  
    // Wait for the table body to be populated with data
    await waitFor(() => screen.getAllByText(/John Doe|Jane Smith/i)); // waits for rowgroup element
  
    const employeeNameCells = await screen.getAllByText(/John Doe|Jane Smith/i);
  
    // Assert that there are at least 2 names
    expect(employeeNameCells.length).toBeGreaterThanOrEqual(2);
  });

  test('clicking on an employee row opens the EmployeeModal for update/delete', async () => {
    render(<UsersPage />);

    await new Promise((resolve) => setTimeout(resolve, 0));

    await waitFor(() => screen.getByText(/John Doe/i).closest('tr')); 
    const firstEmployeeRow = screen.getByText(/John Doe/i).closest('tr');
    fireEvent.click(firstEmployeeRow);

    // Assert that the modal is open and employee details are passed as props
    expect(screen.getByText('Update User')).toBeInTheDocument();
  });

  test('clicking "New Employee" button opens the EmployeeModal for adding a new employee', async () => {
    render(<UsersPage />);

    const newEmployeeButton = screen.getByText(/New Employee/i);
    fireEvent.click(newEmployeeButton);

    expect(screen.getByText('Add User')).toBeInTheDocument();
    // No specific assertion for "adding" since EmployeeModal might handle both cases
  });

  // Consider adding tests for error handling during data fetching
  // (would require mocking axios to return an error)
});
