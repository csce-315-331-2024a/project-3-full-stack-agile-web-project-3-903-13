import Image from "next/image";

export const getMenuItems = async () => {
  const items = await fetch("http://localhost:5000/api/menuitems")
  const data = await items.json()

  return data
}

export default async function Home() {
  const menuItems = await getMenuItems()
  return (
    <main className="min-h-screen flex flex-column items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        
      <h1>MENU ITEMS</h1>
      {menuItems.map(item => (
        <a href="#" className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">

        <h5 key = {item.menuid} className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{item.itemname}</h5>
        </a>
      ))}
      </div>
    </main>
  );
}
