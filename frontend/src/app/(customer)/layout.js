
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
              <CustomerNavbar
                links={[
                  { name: "Menu", route: "/" },
                  { name: "About", route: "/about" },
                  { name: "Menu Board", route: "" },
                  { name: "Nutrition", route: "/nutrition" },
                  { name: "Order Display", route: "" },
                ]}
              />
            {children}
            <CustomerFooter />
          </body>
        </html>
      </CartProvider>
    </TransactionProvider>
  );
}
