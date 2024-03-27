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

export default function ExcessReportPage() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [initialState, setInitialState] = useState([])
    const [usageData, setUsageData] = useState([]);

    const [loading, setLoading] = useState(false);

    const [success, setSuccess] = useState(true);
    const [message, setMessage] = useState('');


    const fetchExcessReport = async () => {
        setLoading(true);

        try {
            const responseState = await fetch(`http://localhost:5000/api/inventory/state?startDate=${startDate}`);
            const responseUsage = await fetch(`http://localhost:5000/api/inventory/usage?startDate=${startDate}&endDate=${endDate}`)
            
            if (!responseState.ok || !responseUsage.ok) {
                throw new Error('Network response was not ok');
            }

            const stateData = await responseState.json();
            const usedInventData = await responseUsage.json();

            if (stateData.length === 0 || usedInventData === 0) {
                setSuccess(false);
                setMessage('No entries found for the selected date range. Please try a different time range.');
            } else {
                setUsageData(usedInventData);
                setInitialState(stateData);
                setMessage('Sales report generated successfully');
            }
        } catch (error) {
            console.error('Error fetching excess report:', error);
            setSuccess(false);
            setMessage('Failed to fetch excess report. Please try again.');
        }

        setLoading(false);
    };

    const handleGenerateReport = (e) => {
        e.preventDefault();
        fetchExcessReport();
    };

    return (
        <main className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="w-full max-w-4xl p-5 bg-white shadow-lg rounded">
                <h1 className="text-xl font-semibold text-center mb-6"> EXCESS REPORT</h1>
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
                    <p className= { success ? "text-green-500" : "text-red-500" }> {message} </p>
                </div>
                {/* {hasFetched && reportData.length === 0 && !loading && (
                    <p className="text-center text-red-500">No entries found for the selected date range. Please try a different time range.</p>
                )} */}
                {/* {reportData.length > 0 && (
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
                )} */}
            </div>
        </main>
    );   
}
