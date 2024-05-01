"use client";

import React, { useEffect, useState } from 'react';

/**
 * Formats the total sales value as a string with two decimal places.
 * It safely handles the conversion of both number and string types to a formatted string.
 * If the input is neither a number nor a convertible string, it returns 'N/A'.
 *
 * @memberOf module:ExcessReportPage
 * @param {number|string} totalSales - The total sales amount to format.
 * @returns {string} The formatted total sales as a string or 'N/A' if the input is invalid.
 */
const formatTotalSales = (totalSales) => {
    if (typeof totalSales === 'number') {
        return totalSales.toFixed(2);
    } else if (typeof totalSales === 'string') {
        const parsed = parseFloat(totalSales);
        return isNaN(parsed) ? 'N/A' : parsed.toFixed(2);
    }
    return 'N/A'; // Return 'N/A' or some other placeholder if the value is not a number
};

/**
 * A React component that fetches and displays an excess inventory report.
 * The report shows items that were used less than a certain threshold percentage.
 * It allows users to select a date range to generate the report for a specific period.
 *
 * @module ExcessReportPage
 * @returns {JSX.Element} The excess report page component.
 */
export default function ExcessReportPage() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [reportData, setReportData] = useState([]);

    const [loading, setLoading] = useState(false);

    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState('');

    /**
     * Initiates the fetching of the excess report based on the selected date range.
     * It handles all aspects of the data fetching process including setting loading states,
     * handling errors, and formatting the received data to be displayed in the UI.
     * @memberOf module:ExcessReportPage
     */
    const fetchExcessReport = async () => {
        setLoading(true);
        setSuccess(false);
        setMessage('');
        setReportData([]);

        try {
            const responseState = await fetch(`https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/inventory/state?startDate=${startDate}`);
            const responseUsage = await fetch(`https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/inventory/usage?startDate=${startDate}&endDate=${endDate}`)

            if (!responseState.ok || !responseUsage.ok) {
                throw new Error('Network response was not ok');
            }

            const stateData = await responseState.json();
            const usedInventData = await responseUsage.json();


            if (stateData.length.length === 0 || usedInventData.length === 0) {
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

    /**
     * Handles the submission of the form to generate the report.
     * It prevents the default form submission event and triggers the fetchExcessReport function.
     * @memberOf module:ExcessReportPage
     * @param {React.FormEvent} e - The event object.
     */
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
                        data-testid="start-date-input"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mb-2 p-2 w-1/5 md:mb-0 md:mr-2 border border-gray-500 bg-white rounded-md focus:outline-none"
                        required
                    />
                    <input
                        data-testid="end-date-input"
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
