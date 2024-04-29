import CreditCardModal from "@/components/transactions/CreditCardModal";
import { useState } from "react";
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';

export default function PaymentModal({ showPaymentOptions, setShowPaymentOptions, handlePayment, enableCreditCardInput = false }) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showCreditCardModal, setShowCreditCardModal] = useState(false);

  const paymentMethods = [
    { id: 'card', label: 'Card' },
    { id: 'dining', label: 'Dining Dollars' },
    { id: 'retail', label: 'Retail Swipe' },
  ];

  const handlePaymentMethodSelect = (methodId) => {
    setSelectedPaymentMethod(methodId);
  };

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