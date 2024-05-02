
import React, {useState} from 'react'

/**
 * A component that provides forms to update or delete employee details.
 * The component displays form fields pre-filled with the current employee data, allowing modifications
 * to fields such as age, phone number, weekly hours, email, and role. It includes functionality to update these details
 * on the server via POST request, or to delete the employee via DELETE request.
 *
 * @module EmployeeUpdateForm
 * @param {Object} employee - The employee object containing the employee's details.
 * @returns {React.Component} A form that enables the user to update or delete the specified employee's data.
 */

export default function EmployeeUpdateForm(employee) {
  let employeeObject = employee.employee

  /**
   * Initializes state for form data and message for the operation's result.
   * Form data is derived from the employee object passed to the component.
   * State hooks are used to manage form inputs and messages dynamically.
   * @memberOf module:EmployeeUpdateForm
   */
  const [formData, setFormData] = useState({
    id: employeeObject.employeeid,
    age: employeeObject.employeeage,
    email: employeeObject.email,
    phone: employeeObject.employeephonenumber,
    role: employeeObject.role,
    hours: employeeObject.employeehours,
  });

  const [message, setMessage] = useState(null)

/**
 * Deletes the employee from the server.
 * This function sends a DELETE request to the server to remove the employee.
 * Upon successful deletion, it sets a success message; if an error occurs, it sets an error message.
 * The page is then reloaded to reflect changes.
 * @memberOf module:EmployeeUpdateForm
 */
  const deleteUser = async () => {
    let deleteResult = await fetch(`https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/employees/${employeeObject.employeeid}`, {
      method: 'DELETE',
    })
    if (deleteResult.status == 200) {
      setMessage("User deleted successfully.")
    } else {
      setMessage("Server encountered error when deleting user.")
    }
    window.location.reload()
  }

  /**
   * Handles form data changes and updates the state accordingly.
   * This function is triggered on input field changes, updating the local state with the new values.
   * @memberOf module:EmployeeUpdateForm
   * @param {Event} event - The input change event.
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * Submits the updated employee data to the server.
   * This function sends a POST request to the server with the updated employee data.
   * Upon successful update, it sets a success message; if an error occurs, it sets an error message.
   * @memberOf module:EmployeeUpdateForm
   * @param {Event} event - The form submission event.
   */
  const handleUpdate = async (event) => {
      event.preventDefault();
      let updateResult = await fetch(`https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/employees/${employeeObject.employeeid}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      if (updateResult.status == 200) {
        setMessage("User updated successfully.")
      } else {
        setMessage("Server encountered error when deleting user.")
      }
      window.location.reload()
  }

  const rolesList = ["manager", "cashier", "kitchen", "admin"]

  return (
    <div className='flex flex-col items-center'>
    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleUpdate}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" for="age">
            Age
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="age" name="age" type="text" placeholder={employeeObject.employeeage} onChange={handleChange}/>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" for="phonenumber">
            Phone Number
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="number" name="number" type="tel" placeholder={employeeObject.employeephonenumber} onChange={handleChange}/>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" for="weeklyhours">
                Weekly Hours
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="hours" name="hours" type="text" placeholder={employeeObject.employeehours} onChange={handleChange}/>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" for="email">
               Email 
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" name="email" type="text" placeholder={employeeObject.email} onChange={handleChange}/>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" for="role">
                Role
          </label>
          <select className="border rounded w-full py-2 px-3 text-gray-700 " id="role" name="role" type="text" onChange={handleChange}>
          {rolesList.map(role => {
            const roleMatches = role == employeeObject.role
            return (roleMatches
              ? <option selected="selected" value={role}>{role}</option>
              : <option value={role}>{role}</option>
            )
          })}
          </select>
        </div>
        <div className="flex items-center justify-between">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Update User
          </button>
          <button className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={deleteUser}>
            Delete User
          </button>
        </div>
      </form>
      <p>{message}</p>
      </div>
  )
}

