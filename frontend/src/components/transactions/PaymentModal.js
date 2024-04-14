export default function PaymentModal({ showPaymentOptions, setShowPaymentOptions, handlePayment, }) {

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-semibold text-center mb-4">Select Payment Method</h3>
                <ul className="space-y-4">
                    <li>
                        <button className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300" onClick={handlePayment}>
                            Card
                        </button>
                    </li>
                    <li>
                        <button className="w-full px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-300" onClick={handlePayment}>
                            Dining Dollars
                        </button>
                    </li>
                    <li>
                        <button className="w-full px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300" onClick={handlePayment}>
                            Retail Swipe
                        </button>
                    </li>
                </ul>
                <div className="text-right mt-4">
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded shadow" onClick={() => setShowPaymentOptions(false)}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )

}