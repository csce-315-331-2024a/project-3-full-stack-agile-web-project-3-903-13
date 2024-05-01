import CreditCardModal from "@/components/transactions/CreditCardModal";
import { useState } from "react";
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';

/**
 * Displays a modal for selecting a payment method. It optionally triggers a credit card input modal if the card method is selected.
 * @function PaymentModal
 * @module PaymentModal
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.showPaymentOptions - Flag to show or hide the payment options modal.
 * @param {function} props.setShowPaymentOptions - Function to set the visibility of the payment options modal.
 * @param {function} props.handlePayment - Function to handle the payment process after a payment method is selected.
 * @param {boolean} [props.enableCreditCardInput=false] - Optional flag to enable credit card input if the card payment method is selected.
 * @returns {React.Component} A React component that renders a modal for payment method selection.
 */
export default function PaymentModal({ showPaymentOptions, setShowPaymentOptions, handlePayment, enableCreditCardInput = false }) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showCreditCardModal, setShowCreditCardModal] = useState(false);

  const paymentMethods = [
    { id: 'card', label: 'Card' },
    { id: 'dining', label: 'Dining Dollars' },
    { id: 'retail', label: 'Retail Swipe' },
  ];

  /**
   * Handles the selection of a payment method from the list by updating the state with the selected method ID.
   * @function handlePaymentMethodSelect
   * @param {string} methodId - The ID of the selected payment method.
   */
  const handlePaymentMethodSelect = (methodId) => {
    setSelectedPaymentMethod(methodId);
  };

  /**
   * Handles the click on the 'Continue' button. If the 'card' payment method is selected and credit card input is enabled,
   * it shows the credit card modal. Otherwise, it proceeds to handle the payment.
   * @function handleContinueClick
   */
  const handleContinueClick = () => {
    if (selectedPaymentMethod === 'card' && enableCreditCardInput) {
      setShowCreditCardModal(true);
    } else {
      handlePayment();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50">
      <div className="relative top-1/4 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 shadow-lg rounded-md bg-white">
        <h3 className="text-3xl font-bold text-center mb-6 pb-2 relative text-red-800">
          Select Payment Method
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-300"></div>
        </h3>
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 border-2 border-red-800 rounded-md bg-white cursor-pointer transition-all duration-200 ease-in-out"
              onClick={() => handlePaymentMethodSelect(method.id)}
            >
              <span className="text-lg font-semibold text-gray-800">{method.label}</span>
              {selectedPaymentMethod === method.id ? (
                <FaCheckCircle className="text-red-800" size="1.5em" />
              ) : (
                <FaRegCircle className="text-red-800" size="1.5em" />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-8">
          <button
            className="py-2 px-4 rounded-md transition-colors duration-200 ease-in-out hover:bg-gray-200 font-semibold"
            onClick={() => setShowPaymentOptions(false)}
          >
            Cancel
          </button>
            <button
              disabled={!selectedPaymentMethod}
              style={{
                boxShadow: '0 2px 4px 0 rgba(0,0,0,0.10)',
                opacity: selectedPaymentMethod ? 1 : 0.5,
              }}
              className={`bg-red-800 text-white px-4 py-2 rounded-md transition-all duration-200 ease-in-out hover:bg-${selectedPaymentMethod ? 'red-800' : 'none'} font-semibold`}
              onClick={handleContinueClick}
            >
            Continue
          </button>
        </div>
      </div>
      {showCreditCardModal && enableCreditCardInput && (
        <CreditCardModal
          showCreditCardModal={showCreditCardModal}
          setShowCreditCardModal={setShowCreditCardModal}
          handlePayment={handlePayment}
        />
      )}
    </div>
  );
}