import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NumericKeypad from '../src/components/transactions/NumericKeypad';

describe('NumericKeypad', () => {
  const onValueChangeMock = jest.fn();
  const onCloseMock = jest.fn();

  beforeEach(() => {
    onValueChangeMock.mockClear();
    onCloseMock.mockClear();
  });

  test('renders correctly with initial value', () => {
    const initialValue = '5';
    render(<NumericKeypad onValueChange={onValueChangeMock} inputValue={initialValue} onClose={onCloseMock} />);

    const displayedValue = screen.getAllByText(initialValue);
    expect(displayedValue.length).toBeGreaterThan(1);
  });


  test('calls onValueChange with correct value when clicking Enter button', () => {
    const initialValue = '10';
    render(<NumericKeypad onValueChange={onValueChangeMock} inputValue={initialValue} onClose={onCloseMock} />);

    const enterButton = screen.getByText('Enter');
    fireEvent.click(enterButton);

    expect(onValueChangeMock).toHaveBeenCalledWith(9);
  });

  test('calls onClose when clicking Cancel button', () => {
    render(<NumericKeypad onValueChange={onValueChangeMock} inputValue="" onClose={onCloseMock} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(onCloseMock).toHaveBeenCalled();
  });
});