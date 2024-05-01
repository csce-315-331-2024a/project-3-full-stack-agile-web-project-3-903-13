import React from 'react';
import EmployeeNavbar from "@/components/EmployeeNavbar";
import { TransactionProvider } from "@/components/transactions/TransactionContext";
import { Suspense } from "react";

/**
 * Provides a layout for the employee section of the application, including a navigation bar and a main content area.
 * This component wraps its children with a `TransactionProvider` to provide transaction context across all its children.
 * It uses the `Suspense` component to handle the loading state of its children, providing a better user experience during data fetching.
 * The navigation bar (`EmployeeNavbar`) includes links to various management sections such as inventory, menu items, and reports.
 *
 * @module UpdateOrder/Layout
 * @param {React.ReactNode} children - Child components to render within the layout.
 * @returns {JSX.Element} A component that includes an employee navigation bar and the main content area for child components.
 */
export default function CategoryLayout({ children }) {
  return (
    <TransactionProvider>
      <>
        <EmployeeNavbar
          links={[
            { name: "Inventory", route: "/employee/manager/inventory" },
            { name: "Menu Items", route: "/employee/manager/menu-items" },
            { name: "Inventory Usage", route: "/employee/manager/inventory-usage" },
            { name: "Excess Report", route: "/employee/manager/excess-report" },
            { name: "Sales Report", route: "/employee/manager/sales-report" },
            { name: "Restock Report", route: "/employee/manager/restock-report" },
            { name: "What Sells Duo", route: "/employee/manager/what-sells-together" },
            { name: "Order Management", route: "/employee/manager/order-management" },
            { name: "Kitchen", route: "/employee/manager/kitchen" }
          ]}
          aria-label="Employee Navigation"
        />
      
        <Suspense fallback={<div>Loading...</div>}>
          <main className="flex-1" aria-labelledby="category-layout-main">
            {children}
          </main>
        </Suspense>
      </>
    </TransactionProvider>
  );
}
