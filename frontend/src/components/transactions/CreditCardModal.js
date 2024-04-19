export default function CreditCardModal({ showCreditCardModal, setShowCreditCardModal, handlePayment }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate payment processing
        handlePayment();
        setShowCreditCardModal(false);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-semibold text-center mb-4">Enter Credit Card Information</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Card Number (16 digits)" pattern="\d{16}" required className="w-full px-4 py-2 border rounded-md"/>
                    <input type="text" placeholder="CVC (3 digits)" pattern="\d{3}" required className="w-full px-4 py-2 border rounded-md"/>
                    <input type="month" min={`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`} required className="w-full px-4 py-2 border rounded-md"/>
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md">Submit</button>
                </form>
                <div className="text-right mt-4">
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded shadow" onClick={() => setShowCreditCardModal(false)}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}