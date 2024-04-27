"use client";

import React, { useEffect, useState } from 'react';

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

    const [reportData, setReportData] = useState([]);

    const [loading, setLoading] = useState(false);

    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState('');

    const fetchExcessReport = async () => {
        setLoading(true);
        setSuccess(false);
        setMessage('');
        setReportData([]);

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

                let tempData = [];

                for (let i = 0; i < stateData.length; i++) {
                    const name = stateData[i].name;
                    const percentUsed = 100 * parseFloat(usedInventData[i].totalinventoryused) / parseFloat(stateData[i].inventorybegin)
                    tempData.push({ name: name, percentUsed: percentUsed });
                }

                tempData = tempData.filter(el => el.percentUsed < 10)
                setReportData(tempData);
                setSuccess(true);
                setMessage('Excess report generated successfully');
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
        <main className="min-h-screen bg-slate-100 flex flex-col">
            <h1 className="text-4xl font-bold text-center mb-3 py-4"> Excess Report </h1>

            <div className="w-full max-w-4xl p-5 bg-white shadow-lg rounded mx-auto">
                <form onSubmit={handleGenerateReport} className="flex flex-col md:flex-row justify-between items-center my-4">
                    <input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mb-2 p-2 w-1/5 md:mb-0 md:mr-2 border border-gray-500 bg-white rounded-md focus:outline-none"
                        required
                    />
                    <input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="mb-2 p-2 w-1/5 md:mb-0 md:mr-2 border border-gray-500 bg-white rounded-md focus:outline-none"
                        required
                    />
                    <button type="submit" className="w-1/5 bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 font-semibold" disabled={loading}>
                        {loading ? 'Loading...' : 'Generate Report'}
                    </button>
                </form>
                {!(success && reportData.length === 0) && (
                    <div className="text-center">
                        <p className={success ? "text-green-500" : "text-red-500"}> {message} </p>
                    </div>
                )}
                {success && reportData.length === 0 && !loading && (
                    <p className="text-center text-green-500"> No item was used less than 10% for the given timeperiod </p>
                )}
                {reportData.length > 0 && (
                    <div className="overflow-auto">
                        <table className="w-full table-auto border-collapse border border-gray-500" aria-label= "Excess Report Data">
                            <thead>
                                <tr>
                                    <th className="border border-gray-400 px-4 py-2">Item Name</th>
                                    <th className="border border-gray-400 px-4 py-2"> Percent Sold</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-400 px-4 py-2">{item.name}</td>
                                        <td className="border border-gray-400 px-4 py-2">{formatTotalSales(item.percentUsed)}</td>
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
