/**
 * @module EmployeeModal
 */
import React, { useState } from "react";
import EmployeeUpdateForm from "./EmployeeUpdateForm";
import EmployeeAddForm from "./EmployeeAddForm";
import Link from 'next/link'

/**
 * Represents a modal component that handles updating, deleting, or adding employees.
 * It conditionally renders either the EmployeeUpdateForm or EmployeeAddForm based on the provided props.
 * This component also manages API requests to update or delete an employee and displays status messages based on the results of these operations.
 *
 * @function EmployeeModal
 * @memberOf module:EmployeeModal
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.isOpen - Controls if the modal is open or not.
 * @param {function} props.onClose - Function to call to close the modal.
 * @param {Object} props.employee - The employee object containing details of the employee when updating or deleting.
 * @param {boolean} props.isUpdateDelete - Flag to determine if the modal should handle update/delete (true) or add (false) operations.
 * @returns {React.Component|null} Returns a React component that renders the appropriate form within a modal or null if the modal is not open.
 */
export default function EmployeeModal({isOpen, onClose, employee, isUpdateDelete}) {

  const [message, setMessage] = useState(null)

  if (!isOpen) return null;

  /**
   * Handles the update operation for an employee.
   * This function sends a POST request to the server with the updated employee data. If successful, it sets a success message;
   * otherwise, it sets an error message.
   * @memberOf module:EmployeeModal
   */
  const updateUser = async () => {
    let updateResult = await fetch(``, {
      method: 'POST',
      body: {
        'age': age,
        'number': number,
        'email': email, 
        'hours': hours,
        'role': role
      }
    })
    if (updateResult.status == 200) {
      setMessage("User update successfully.")
    } else {
      setMessage("Server encountered error when updating user.")
    }
  }


  /**
   * Handles the delete operation for an employee.
   * This function sends a DELETE request to the server to remove the specified employee. If successful, it sets a success message;
   * otherwise, it sets an error message.
   * @memberOf module:EmployeeModal
   */
  const deleteUser = async () => {
    let deleteResult = await fetch(`https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/employees/${employee.employeeid}`, {
      method: 'DELETE',
    })
    if (deleteResult.status == 200) {
      setMessage("User deleted successfully.")
    } else {
      setMessage("Server encountered error when deleting user.")
    }
  }

  return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative">
              <div className="bg-white p-2 rounded-lg shadow-lg">
                  <button
                      className="absolute top-3 right-4 text-gray-500 hover:text-gray-700"
                      onClick={onClose}
                  >
                      <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                      >
                          <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                          />
                      </svg>
                  </button>
                  <div className="w-96 flex flex-col items-center">
                    {employee && <h1>{employee.employeename}</h1>}
                    {isUpdateDelete
                    ? <EmployeeUpdateForm employee={employee}/>
                    : <EmployeeAddForm/> 
                    }
                  </div>
              </div>
          </div>
      </div>
  )
}

