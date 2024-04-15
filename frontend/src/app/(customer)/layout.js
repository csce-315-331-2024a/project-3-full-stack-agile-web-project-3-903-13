
import { Inter } from "next/font/google";
import "../globals.css";
import CustomerNavbar from "@/components/CustomerNavbar";
import ClockWidget from "@/components/DigitalClock";
import { TransactionProvider } from "@/components/transactions/TransactionContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <TransactionProvider>
      <html lang="en">
        <body className={inter.className}>
          <CustomerNavbar
            links={[
              { name: "Menu", route: "/" },
              { name: "About", route: "/about" },
              { name: "Menu Board", route: "" },
            ]}
          />

          <ClockWidget></ClockWidget>
          {children}
        </body>
      </html>
    </TransactionProvider>
  );
}
