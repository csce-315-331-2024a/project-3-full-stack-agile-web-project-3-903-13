"use client";

import React, { useState } from 'react';

/**
 * Formats total sales as a fixed decimal string safely, returning a formatted string or a placeholder if the input is invalid.
 * @memberOf module:SalesReportPage
 * @param {number|string} totalSales - The total sales amount to be formatted.
 * @returns {string} Formatted total sales as a string with two decimal places or 'N/A' if invalid.
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
 * SalesReportPage is a React component for generating and displaying a sales report for a specified date range.
 * It allows users to select a start and end date and fetches the sales report data accordingly.
 * @module SalesReportPage
 */
export default function SalesReportPage() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [hasFetched, setHasFetched] = useState(false);

    /**
     * Fetches the sales report data from the server using the specified start and end date.
     * Updates the UI based on the data received or any errors encountered during fetching.
     * @memberOf module:SalesReportPage
     */
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

    /**
     * Handles the form submission to generate a sales report by preventing the default form submission behavior and calling fetchSalesReport.
     * @memberOf module:SalesReportPage
     * @param {Event} e - The event object associated with the form submission.
     */
    const handleGenerateReport = (e) => {
        e.preventDefault();
        fetchSalesReport();
    };

    return (
        <main className="min-h-screen bg-slate-100 flex flex-col"  aria-labelledby="sales-report-title">
            <h1 className="text-4xl font-bold text-center mb-3 py-4">Sales Report</h1>

            <div className="w-full max-w-4xl p-5 bg-white shadow-md rounded-md mx-auto">
                <form onSubmit={handleGenerateReport} className="flex flex-col md:flex-row justify-between items-center my-4">
                    <input
                        data-testid= "start date"
                        type="date"
                        id="startdate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mb-2 p-2 w-1/5 md:mb-0 md:mr-2 border border-gray-500 bg-white rounded-md focus:outline-none"
                        required
                        aria-label="Start Date"
                    />
                    <input
                        data-testid= "end date"
                        type="date"
                        id="enddate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="mb-2 p-2 w-1/5 md:mb-0 md:mr-2 border border-gray-500 bg-white rounded-md focus:outline-none"
                        required
                        aria-label="End Date"
                    />
                    <button type="submit" className="w-1/5 bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 font-semibold" disabled={loading}>
                        {loading ? 'Loading...' : 'Generate Report'}
                    </button>
                </form>
                <div className="text-center">
                    {errorMessage && <p className="text-red-500"aria-live="assertive">{errorMessage}</p>}
                    {successMessage && <p className="text-green-500"aria-live="assertive">{successMessage}</p>}
                </div>
                {hasFetched && reportData.length === 0 && !loading && (
                    <p className="text-center text-red-500" aria-live="assertive">No entries found for the selected date range. Please try a different time range.</p>
                )}
                {reportData.length > 0 && (
                    <div className="overflow-auto">
                        <table className="w-full table-auto border-collapse border border-gray-500"  aria-label="Sales Report">
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
