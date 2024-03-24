import Image from "next/image";

export default function Page({ menuItems }) {
  return (
    <main className="min-h-screen flex flex-column items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <h1>MENU ITEMS</h1>
        {menuItems.map(item => (
          <a href="#" className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700" key={item.menuid}>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{item.itemname} {item.price}</h5>
          </a>
        ))}
        {/* Add your form for adding new menu items here */}
        <div className="mt-4">
          <h2>Add New Menu Item</h2>
          {/* Your form inputs and submit button */}
        </div>
      </div>
    </main>
  );
}
