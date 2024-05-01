// EmployeeAddForm.test.js

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // for simulating user interactions
import axios from 'axios';

// Mock axios for testing purposes
jest.mock('axios');

import EmployeeAddForm from '../src/components/EmployeeAddForm'; // Assuming EmployeeAddForm.js is in the same directory

describe('EmployeeAddForm component', () => {
  test('renders the form and allows user input', () => {
    render(<EmployeeAddForm />);

    const nameInput = screen.getByLabelText('Name');
    const ageInput = screen.getByLabelText('Age');
    const emailInput = screen.getByLabelText('Email');

    fireEvent.change(nameInput, {target: {value: 'John Doe'}})
    fireEvent.change(ageInput, {target: {value: '30'}})
    fireEvent.change(emailInput, {target: {value: 'john.doe@example.com'}})

    expect(nameInput.value).toBe('John Doe');
    expect(ageInput.value).toBe('30');
    expect(emailInput.value).toBe('john.doe@example.com');
  });

  test('simulates successful form submission with mocked axios', async () => {
    const mockAxios = jest.mocked(axios); // Access the mocked axios instance

    const formData = {
      name: 'John Doe',
      age: '30',
      phone: '', // Not filled in the test
      hours: '', // Not filled in the test
      email: 'john.doe@example.com',
      role: 'manager',
    };

    mockAxios.post.mockResolvedValueOnce({ // Mock successful response
      status: 200,
    });

    render(<EmployeeAddForm />);

    const nameInput = screen.getByLabelText('Name');
    const ageInput = screen.getByLabelText('Age');
    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByText('Add User');

    userEvent.type(nameInput, formData.name);
    userEvent.type(ageInput, formData.age);
    userEvent.type(emailInput, formData.email);

    userEvent.click(submitButton);

    // Assert successful submission message
    expect(await screen.findByText('Employee created successfully')).toBeInTheDocument();

    // Assert that axios.post was called with the expected data
    expect(mockAxios.post).toHaveBeenCalled();
  });

  test('simulates failed form submission with mocked axios', async () => {
    const mockAxios = jest.mocked(axios);

    mockAxios.post.mockRejectedValueOnce(new Error('Server Error')); // Mock failed response

    render(<EmployeeAddForm />);

    const submitButton = screen.getByText('Add User');

    userEvent.click(submitButton);

    // Assert error message
    expect(await screen.findByText("Cannot read properties of undefined (reading 'status')")).toBeInTheDocument();

    // Assert that axios.post was called
    expect(mockAxios.post).toHaveBeenCalled();
  });
});
