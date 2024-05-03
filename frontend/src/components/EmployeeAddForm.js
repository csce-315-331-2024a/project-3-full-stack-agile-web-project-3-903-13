/**
 * @module EmployeeAddForm
 */
import React, {useState} from 'react'
import axios from 'axios';

/**
 * Represents a form component for adding a new employee to the system.
 * This form collects details like name, age, phone number, weekly hours, email, and role.
 * Upon form submission, it sends these details to a server endpoint via a POST request.
 * Depending on the response status, it displays a success or error message and reloads the page.
 *
 * @function EmployeeAddForm
 * @memberOf module:EmployeeAddForm
 * @returns {React.Component} A React component that provides a user interface for adding a new employee, with input validation and submission handling.
 */
export default function EmployeeAddForm() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '', 
    hours: '',
    email: '',
    role: 'manager'
  });

  /**
   * Submits the employee data to the server.
   * This function sends a POST request to the server with the new employee's data.
   * It sets a message depending on the success or failure of the operation and reloads the page to reflect changes.
   * 
   * @memberOf module:EmployeeAddForm
   * @param {Event} event - The form submission event, which is prevented from its default action.
   */
  const addUser = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/employees",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setMessage("Employee created successfully");
      } else {
        throw new Error("Server Error: could not create employee");
      }
    } catch (error) {
      setMessage(error.message); // Set error message
    } 
    window.location.reload();
  }

  /**
   * Handles changes in form inputs and updates the form data state accordingly.
   * This function dynamically updates the state for each form field based on input changes.
   * 
   * @memberOf module:EmployeeAddForm
   * @param {Event} event - The event object containing the name of the form field and the new value.
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const rolesList = ["manager", "cashier", "kitchen", "admin"]

  const [message, setMessage] = useState(null)

  return (
    <div className='flex flex-col items-center'>
    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={addUser}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" for="name">
            Name
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" name="name" type="text" required="true" onChange={handleChange}/>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" for="age">
            Age
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="age" name="age" type="number" min="0" required="true" onChange={handleChange}/>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" for="phone">
            Phone Number (###) ###-####
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="phone" name="phone" type="tel" pattern="\([0-9]{3}\) [0-9]{3}-[0-9]{4}" required="true" onChange={handleChange}/>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" for="hours">
                Weekly Hours
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="hours" name="hours" type="number" min="0" required="true" onChange={handleChange}/>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" for="email">
              Email
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" name="email" type="email" required="true" onChange={handleChange}/>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" for="role">
                Role
          </label>
          <select className="border rounded w-full py-2 px-3 text-gray-700 " id="role" name="role" type="text" required="true" onChange={handleChange}>
          {rolesList.map(role => {
            return (
              <option value={role}>{role}</option>
            )
          })}
          </select>
        </div>
        <div className="flex flex-col items-center justify-between">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Add User
          </button>
        </div>
      </form>
      <p>{message}</p>
      </div>
  )
}

