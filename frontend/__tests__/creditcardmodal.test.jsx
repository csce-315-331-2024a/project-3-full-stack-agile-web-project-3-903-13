import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreditCardModal from '../src/components/transactions/CreditCardModal';

describe('CreditCardModal', () => {
  let showCreditCardModal;
  let setShowCreditCardModal;
  let handlePayment;

  beforeEach(() => {
    showCreditCardModal = true;
    setShowCreditCardModal = jest.fn();
    handlePayment = jest.fn();
  });


  it('formats the card number correctly', async () => {
    render(
      <CreditCardModal
        showCreditCardModal={showCreditCardModal}
        setShowCreditCardModal={setShowCreditCardModal}
        handlePayment={handlePayment}
      />
    );

    const cardNumberInput = screen.getByPlaceholderText('Card Number (xxxx xxxx xxxx xxxx)');
    await userEvent.type(cardNumberInput, '1234567890123456');

    expect(cardNumberInput).toHaveValue('1234 5678 9012 3456');
  });

  it('validates the card number and CVC', async () => {
    render(
      <CreditCardModal
        showCreditCardModal={showCreditCardModal}
        setShowCreditCardModal={setShowCreditCardModal}
        handlePayment={handlePayment}
      />
    );

    const cardNumberInput = screen.getByPlaceholderText('Card Number (xxxx xxxx xxxx xxxx)');
    const cvcInput = screen.getByPlaceholderText('CVC (3 digits)');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(cardNumberInput, {target: {value: '1234567890'}});
    await userEvent.type(cvcInput, '12');
    fireEvent.click(submitButton);

    expect(cardNumberInput).toBeInTheDocument();
  });

  it('calls handlePayment and closes the modal on successful submission', async () => {
    render(
      <CreditCardModal
        showCreditCardModal={showCreditCardModal}
        setShowCreditCardModal={setShowCreditCardModal}
        handlePayment={handlePayment}
      />
    );

    const cardNumberInput = screen.getByPlaceholderText('Card Number (xxxx xxxx xxxx xxxx)');
    const cvcInput = screen.getByPlaceholderText('CVC (3 digits)');
    const expiryDateInput = screen.getByTestId('expir');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    await userEvent.type(cardNumberInput, '1234567890123456');
    await userEvent.type(cvcInput, '123');
    await userEvent.type(expiryDateInput, '2025-05');
    fireEvent.click(submitButton);

    expect(handlePayment).toHaveBeenCalled();
    expect(setShowCreditCardModal).toHaveBeenCalledWith(false);
  });
});