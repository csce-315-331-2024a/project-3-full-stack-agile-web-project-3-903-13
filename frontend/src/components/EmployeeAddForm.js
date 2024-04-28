import React, {useState} from 'react'

export default function EmployeeAddForm() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '', 
    hours: '',
    role: 'manager'
  });

  const addUser = async (event) => {
    event.preventDefault()
    console.log(formData)
    const result = await fetch("http://localhost:5000/api/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData)
    })
    if (result.status == 200) {
      setMessage("Employee created successfully")
    } else {
      setMessage("Server Error: could not create employee")
    }
    window.location.reload()
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData)
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
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" name="name" type="text"onChange={handleChange}/>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" for="age">
            Age
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="age" name="age" type="text" onChange={handleChange}/>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" for="phone">
            Phone Number
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="phone" name="phone" type="tel" onChange={handleChange}/>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" for="hours">
                Weekly Hours
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="hours" name="hours" type="text" onChange={handleChange}/>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" for="role">
                Role
          </label>
          <select className="border rounded w-full py-2 px-3 text-gray-700 " id="role" name="role" type="text" onChange={handleChange}>
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

