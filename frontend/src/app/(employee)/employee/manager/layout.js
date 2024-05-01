import "../../../globals.css";
import EmployeeNavbar from "@/components/EmployeeNavbar";

/**
 * A layout component for the manager section that includes an `EmployeeNavbar` and a main content area.
 * This layout integrates navigational links specific to managerial functions and displays the passed children components
 * within the main content area.
 *
 * @module ManagerLayout
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - Child components to be rendered inside the layout's main section.
 * @returns {JSX.Element} The JSX code for manager layout component.
 */
export default function ManagerLayout({ children }) {
  return (
    <>
      <EmployeeNavbar
        links={[
          { name: "Inventory", route: "/employee/manager/inventory" },
          { name: "Menu Items", route: "/employee/manager/menu-items" },
          { name: "Inventory Usage", route: "/employee/manager/inventory-usage" },
          { name: "Menu Item Popularity", route: "/employee/manager/menu-item-popularity" },
          { name: "Excess Report", route: "/employee/manager/excess-report" },
          { name: "Sales Report", route: "/employee/manager/sales-report" },
          { name: "Restock Report", route: "/employee/manager/restock-report" },
          { name: "What Sells Duo", route: "/employee/manager/what-sells-together" },
          { name: "Order Management", route: "/employee/manager/order-management" },
          { name: "Kitchen", route: "/employee/manager/kitchen" }
        ]}
    
      ></EmployeeNavbar>

      <main role ="main" aria-label="Manager Content" className="flex-1">{children}</main>
    </>
  );
}