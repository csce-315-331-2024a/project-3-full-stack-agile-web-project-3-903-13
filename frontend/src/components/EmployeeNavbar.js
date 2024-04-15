"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import GoogleTranslateWidget from "@/components/GoogleTranslate";

export default function EmployeeNavbar({ links }) {
  const pathname = usePathname();
  return (
    <nav className="flex w-full h-[5rem] bg-white shadow-md">
      <div className="flex w-full h-full justify-between items-center px-6 font-bold [&>*>li]:relative">
        <ul className="flex flex-row gap-8 items-center">
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
          <GoogleTranslateWidget />
      </div>
    </nav>
  );
}
