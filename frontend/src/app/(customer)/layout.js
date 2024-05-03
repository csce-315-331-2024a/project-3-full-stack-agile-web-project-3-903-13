import { Inter } from "next/font/google";
import "../globals.css";
import CustomerNavbar from "@/components/CustomerNavbar";
import CustomerFooter from "@/components/Footer";
import { TransactionProvider } from "@/components/transactions/TransactionContext";
import { CartProvider } from '@/components/CartContext';
import ChatComponent from "@/components/ChatComponent";

const inter = Inter({ subsets: ["latin"] });

 /**
 * Predefined metadata for the application, setting the title and description for SEO and accessibility purposes.
 *
 * @constant
 * @memberOf module:CustomerHome/Layout
 * @type {{title: string, description: string}}
 */
export const metadata = {
  title: 'Rev\'s Grill',
  description: 'Burgers, fries, shakes and more!',
};

/**
 * RootLayout is a higher-order component that wraps the entire application, providing context providers
 * and layout components that are common across all pages. It includes transaction and cart context providers
 * to manage state related to transactions and cart operations across the application. The component also
 * integrates global styles and sets up the page structure with a navigation bar and footer.
 *
 * @component
 * @module CustomerHome/Layout
 * @param {Object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - Child components that will be rendered within this layout.
 * @returns {React.Component} The RootLayout component which sets up the application structure.
 */
export default function RootLayout({ children }) {
  return (
    <TransactionProvider>
      <CartProvider>
        <html lang="en">
          <body className={inter.className}>
            <nav role="navigation">
              <CustomerNavbar
              
              /**
               * @typedef {Object} Link
               * @memberOf module:CustomerHome/Layout
               * @property {string} name - The name of the link to display.
               * @property {string} route - The path the link routes to.
               * @property {string} label - ARIA label for better accessibility.
               */
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
            <ChatComponent></ChatComponent>
            <CustomerFooter />
          </body>
        </html>
      </CartProvider>
    </TransactionProvider>
  );
}