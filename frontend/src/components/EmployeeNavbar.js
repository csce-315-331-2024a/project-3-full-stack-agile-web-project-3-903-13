"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function EmployeeNavbar({ links }) {
  const pathname = usePathname();
  return (
    <nav className="flex w-full h-[5rem] bg-white shadow-md">
        <ul className="flex flex-row w-full h-full items-center px-6 font-bold gap-8">
          {links.map((link) => (
            <li key={link.route}>
              <Link
                className={
                  pathname === link.route ? "nav-link-active" : "nav-link"
                }
                href={link.route}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
    </nav>
  );
}
