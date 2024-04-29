import { Inter } from "next/font/google";
import "../globals.css";
import CustomerNavbar from "@/components/CustomerNavbar";
import CustomerFooter from "@/components/Footer";
import { TransactionProvider } from "@/components/transactions/TransactionContext";
import { CartProvider } from '@/components/CartContext';


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <TransactionProvider>
      <CartProvider>
        <html lang="en">
          <body className={inter.className}>
            <nav role="navigation">
              <CustomerNavbar

                links={[
                  { name: "Menu", route: "/" , label: "Navigate to Menu"},
                  { name: "About", route: "/about", label: "Learn about us"},
                  { name: "Menu Board", route: "" ,label :" View our menu board"},
                  { name: "Nutrition", route: "/nutrition",label: "Explore our nurtrition Information" },
                  { name: "Order Display", route: "",label: "View the Order Display" },
                ]}
              />
             </nav>
            {children}
            <CustomerFooter />
          </body>
        </html>
      </CartProvider>
    </TransactionProvider>
  );
}