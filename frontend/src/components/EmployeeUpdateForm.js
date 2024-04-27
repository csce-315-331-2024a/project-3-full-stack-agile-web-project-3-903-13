import React, {useState} from 'react'

export default function EmployeeUpdateForm(employee) {
  let employeeObject = employee.employee
  const [formData, setFormData] = useState({
    id: employeeObject.employeeid,
    age: employeeObject.employeeage,
    phone: employeeObject.employeephonenumber,
    role: employeeObject.role,
    hours: employeeObject.employeehours,
  });

  const [message, setMessage] = useState(null)

  const deleteUser = async () => {
    let deleteResult = await fetch(`http://localhost:5000/api/employees/${employeeObject.employeeid}`, {
      method: 'DELETE',
    })
    if (deleteResult.status == 200) {
      setMessage("User deleted successfully.")
    } else {
      setMessage("Server encountered error when deleting user.")
    }
    window.location.reload()
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (event) => {
      event.preventDefault();
      let updateResult = await fetch(`http://localhost:5000/api/employees/${employeeObject.employeeid}`, {
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

