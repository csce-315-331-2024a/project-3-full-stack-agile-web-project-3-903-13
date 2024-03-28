import Link from 'next/link';

const categories = [
  { name: "Burgers", path: "/category/burgers", image: "/images/burgers.png" },
  { name: "Hotdogs/Corndogs", path: "/category/hotdogs", image: "/images/hotdogs-corndogs.jpg" },
  { name: "Chicken Tenders", path: "/category/tenders", image: "/images/chicken-tenders.jpg" },
  { name: "Sides", path: "/category/fries", image: "/images/sides.jpg" },
  { name: "Shakes", path: "/category/shakes", image: "/images/shakes.jpg" },
  { name: "Beverages", path: "/category/beverages", image: "/images/beverages.jpg" },
  { name: "Seasonal", path: "/category/seasonal", image: "/images/seasonal.jpg" }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-cream flex flex-wrap justify-center items-center">
      {categories.map(category => (
        <Link key={category.name} href={category.path}>
          <div className="m-4 cursor-pointer">
            <div className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img src={category.image} alt={category.name} className="w-full h-auto" />
              <div className="py-4 text-center bg-white">
                <span className="block text-lg font-semibold text-gray-800">{category.name}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </main>
  );
}
