"use client";

import React, { useState } from 'react';

// Function to safely format total sales as a fixed decimal string
const formatTotalSales = (totalSales) => {
    if (typeof totalSales === 'number') {
        return totalSales.toFixed(2);
    } else if (typeof totalSales === 'string') {
        const parsed = parseFloat(totalSales);
        return isNaN(parsed) ? 'N/A' : parsed.toFixed(2);
    }
    return 'N/A'; // Return 'N/A' or some other placeholder if the value is not a number
};

export default function SalesReportPage() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [hasFetched, setHasFetched] = useState(false);

    const fetchSalesReport = async () => {
        setLoading(true);
        setHasFetched(true); // Set to true when fetching
        setErrorMessage('');
        setSuccessMessage('');
        try {
            const response = await fetch(`https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/reports/salesreport?startDate=${startDate}&endDate=${endDate}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data.length === 0) {
                setErrorMessage('No entries found for the selected date range. Please try a different time range.');
            } else {
                setReportData(data);
                setSuccessMessage('Sales report generated successfully');
                setErrorMessage(''); // Clear error message if data is found
            }
        } catch (error) {
            console.error('Error fetching sales report:', error);
            setErrorMessage('Failed to fetch sales report. Please try again.');
        }
        setLoading(false);
    };

    const handleGenerateReport = (e) => {
        e.preventDefault();
        fetchSalesReport();
    };

    return (
        <main className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="w-full max-w-4xl p-5 bg-white shadow-lg rounded">
                <h1 className="text-xl font-semibold text-center mb-6">SALES REPORT</h1>
                <form onSubmit={handleGenerateReport} className="flex flex-col md:flex-row justify-between items-center mb-4">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mb-2 md:mb-0 md:mr-2"
                        required
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="mb-2 md:mb-0 md:mr-2"
                        required
                    />
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2" disabled={loading}>
                        {loading ? 'Loading...' : 'Generate Report'}
                    </button>
                </form>
                <div className="text-center">
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    {successMessage && <p className="text-green-500">{successMessage}</p>}
                </div>
                {hasFetched && reportData.length === 0 && !loading && (
                    <p className="text-center text-red-500">No entries found for the selected date range. Please try a different time range.</p>
                )}
                {reportData.length > 0 && (
                    <div className="overflow-auto">
                        <table className="w-full table-auto border-collapse border border-gray-500">
                            <thead>
                                <tr>
                                    <th className="border border-gray-400 px-4 py-2">Item Name</th>
                                    <th className="border border-gray-400 px-4 py-2">Quantity Sold</th>
                                    <th className="border border-gray-400 px-4 py-2">Total Sales</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-400 px-4 py-2">{item.itemname}</td>
                                        <td className="border border-gray-400 px-4 py-2">{item.quantity_sold}</td>
                                        <td className="border border-gray-400 px-4 py-2">${formatTotalSales(item.total_sales)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );   
}
