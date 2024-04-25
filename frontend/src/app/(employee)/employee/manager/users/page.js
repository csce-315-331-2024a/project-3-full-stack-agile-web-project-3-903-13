"use client";

import React, { useEffect, useState } from 'react';

export default function usersPage() {

    const [employees, setEmployees] = useState([])

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const employees = await fetch(`http://localhost:5000/api/employees`);

                if (!employees.ok) {
                    throw new Error('Network response was not ok');
                }

                const employeesData = await employees.json();
                setEmployees(employeesData)
            } catch (error) {
                console.error('Error retrieving users:', error);
            }
        };

        fetchEmployees()

    }, [])

    return (
        <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col w-4/5 border-solid border-grey border-2">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="border rounded-lg divide-y divide-gray-200">
                <div className="py-3 px-4">
                  <div className="relative max-w-xs">
                    <label htmlFor="hs-table-search" className="sr-only" text="Search">Search</label>
                    <input type="text" name="hs-table-search" id="hs-table-search" className="py-2 px-3 ps-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="Search Employees"/>
                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                      <svg className="size-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Employee ID</th>
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Phone Number</th>
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Age</th>
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Weekly Hours</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {employees.map((employee, index) => (
                        <tr key={index} onClick={() => {}}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{employee.employeename}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{employee.employeeid}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{employee.employeephonenumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{employee.employeeage}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{employee.employeehours}</td>
                        </tr>
                    ))}
                    </tbody>
                    </table>
                  </div>
                  </div>
              </div>
              </div>
          </div>
        </main>
    );
}
