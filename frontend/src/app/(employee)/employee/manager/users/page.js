"use client";

import React, { useEffect, useState } from 'react';
import EmployeeModal from "@/components/EmployeeModal"

export default function UsersPage() {

    const [employees, setEmployees] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateDelete, setIsUpdateDelete] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const closeModal = () => {
        setIsModalOpen(false);
        setIsUpdateDelete(false)
        setSelectedEmployee(null)
    };

    const employeeClick = (employee) => {
      setSelectedEmployee(employee)
      setIsUpdateDelete(true)
      setIsModalOpen(true)
    }

    const addUserClick = () => {
      setIsModalOpen(true)
      //setIsNewUserOpen(true)
    }

    const closeAddUser = () => {
      setIsNewUserOpen(false)
    }

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
        <main className="min-h-screen bg-gray-100 flex items-center justify-center" aria-labelledby="users-page-title">
        <div className="flex flex-col w-4/5 border-solid border-grey border-2">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="border rounded-lg divide-y divide-gray-200">
                <div className="py-3 px-4">
                  <div className="relative max-w-xs flex flex-row gap-5">
                  <button type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm w-50 px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={addUserClick}>New Employee</button>
                  </div>
                </div>
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200" aria-labelledby="users-table">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Phone Number</th>
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Age</th>
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Weekly Hours</th>
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {employees.map((employee, index) => (
                        <tr key={index} onClick={() => {employeeClick(employee)}} className="hover:bg-gray-400 hover:cursor-pointer">
                            <td className=" px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{employee.employeename}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{employee.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{employee.employeephonenumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{employee.employeeage}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{employee.employeehours}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{employee.role}</td>
                        </tr>
                    ))}
                    </tbody>
                    </table>
                  </div>
                  </div>
              </div>
              </div>
          </div>

          <EmployeeModal
            isOpen={isModalOpen}
            isUpdateDelete={isUpdateDelete}
            onClose={closeModal}
            employee={selectedEmployee}
          />
        </main>
    );
}
