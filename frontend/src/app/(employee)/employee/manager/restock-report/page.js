
"use client";

import React, { useState, useEffect } from 'react';
import { useTable } from "react-table";
import axios from 'axios';

/**
 * RestockReportPage is a React component that fetches and displays a list of inventory items
 * that need to be restocked. It provides buttons to regenerate the report and to fulfill restock orders.
 * @module RestockReportPage
 */
const RestockReportPage = () => {
    const [restockItems, setRestockItems] = useState([]);
    const [loading, setLoading] = useState(true);

    /**
     * fetchData is used within the RestockReportPage component to fetch restock data from the server.
     * It sets the loading state, fetches data using axios, and updates the state with the fetched data or an error.
     * @memberOf module:RestockReportPage
     */
    const fetchData = () => {
        setLoading(true);
        axios.get('https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/reports/restockReport')
            .then(response => {
                setRestockItems(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching restock data:', error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    /**
     * fulfillRestock makes a PATCH request to update the restock status of inventory items.
     * It handles the response or error by logging them to the console.
     * @memberOf module:RestockReportPage
     */
    const fulfillRestock = () => {
        // Call the backend to fulfill restock orders
        axios.patch('https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/reports/restockInventory')
            .then(response => {
                // Optionally handle success (e.g., show success message)
                console.log('Restock fulfilled successfully:', response.data);
            })
            .catch(error => {
                // Handle error (e.g., show error message)
                console.error('Error fulfilling restock:', error);
            });
    };


    const columns = [
        {
            Header: 'InventID',
            accessor: 'inventid'
        },
        {
            Header: 'Ingredient Name',
            accessor: 'ingredientname'
        },
        {
            Header: 'Count',
            accessor: 'count'
        },
        {
            Header: 'Price',
            accessor: 'price'
        },
        {
            Header: 'Min Count',
            accessor: 'mincount'
        }
    ];

    return (
        <main className="min-h-screen bg-slate-100 flex flex-col"  aria-labelledby="restock-report-title">
            <h1 className="text-4xl font-bold text-center mb-3 py-4">Restock Report </h1>

            <div className="w-full max-w-4xl p-5 bg-white shadow-lg rounded mx-auto">
                <button
                    onClick={fetchData}
                    className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    aria-label="Regenerate report button"
                >
                    Regenerate Report
                </button>

                <button
                    onClick={fulfillRestock}
                    className="mb-4 ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    aria-label="Fulfill restock button"
                >
                    Fulfill Restock
                </button>

                <div>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Restock Items</h2>
                            {restockItems.length > 0 ? (
                                <Table columns={columns} data={restockItems} />
                            ) : (
                                <p>No restock items available.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

/**
 * Table is a React component that uses react-table hooks to display data in a table format.
 * It takes columns and data as props and constructs a table with sortable headers and rows.
 * @memberOf module:RestockReportPage
 */
const Table = ({ columns, data }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({ columns, data });

    return (
        <table {...getTableProps()} className="w-full" aria-label="Restock items table">
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()} className="border px-4 py-2">{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()} className="border px-4 py-2">{cell.render('Cell')}</td>;
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default RestockReportPage;



