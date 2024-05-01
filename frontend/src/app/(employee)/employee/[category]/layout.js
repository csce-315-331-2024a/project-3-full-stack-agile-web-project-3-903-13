import EmployeeNavbar from "@/components/EmployeeNavbar";
import "../../../globals.css";
import { TransactionProvider } from "@/components/transactions/TransactionContext";

/**
 * CategoryLayout is a layout component that wraps the children components
 * in a navigation context provided by TransactionProvider. It includes an EmployeeNavbar
 * for navigating between different food categories within an employee interface.
 * 
 * @component
 * @module TransactionPanelEmployee/Layout
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to be rendered within the layout.
 * @returns {React.Component} The CategoryLayout component which includes a navigation bar and main content area.
 */
export default function CategoryLayout({ children }) {
  return (
    <TransactionProvider>
    <>
    <nav aria-label="Employee category navigation">
      <EmployeeNavbar
        links={[
          { name: "Burgers", route: "/employee/burgers" ,label:"Explore Burgers"},
          { name: "Tenders", route: "/employee/tenders",label:"Explore Tenders" },
          { name: "Hot Dogs", route: "/employee/hotdogs",label:"Explore Hot Dogs" },
          { name: "Fries", route: "/employee/fries",label:"Explore Fries" },
          { name: "Ice Cream", route: "/employee/ice-cream",label:"Explore Ice Cream" },
          { name: "Beverages", route: "/employee/beverages",label:"Explore Beverages" },
          { name: "Seasonal", route: "/employee/seasonal",label:"Explore Seasonal" },
        ]}
      />
    </nav>
      <main className="flex-1" role ="main" aria-label="Employee category content">{children}</main>
    </>
    </TransactionProvider>
  );
}
