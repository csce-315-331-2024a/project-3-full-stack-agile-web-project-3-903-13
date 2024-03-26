import { Inter } from "next/font/google";
import "./globals.css";
import CustomerNavbar from "@/components/CustomerNavbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Rev's Grill",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CustomerNavbar
          links={[
            { name: "Menu", route: "/menu" },
            { name: "About", route: "/about" },
          ]}
        />
        {children}
      </body>
    </html>
  );
}
