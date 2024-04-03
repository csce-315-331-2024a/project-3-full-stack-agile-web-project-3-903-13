import EmployeeNavbar from "@/components/EmployeeNavbar";
import "../../../globals.css";
import { TransactionProvider } from "@/components/TransactionContext";

export default function CategoryLayout({ children }) {
  return (
    <TransactionProvider>
    <>
      <EmployeeNavbar
        links={[
          { name: "Burgers", route: "/employee/burgers" },
          { name: "Tenders", route: "/employee/tenders" },
          { name: "Hot Dogs", route: "/employee/hotdogs" },
          { name: "Fries", route: "/employee/fries" },
          { name: "Ice Cream", route: "/employee/ice-cream" },
          { name: "Beverages", route: "/employee/beverages" },
          { name: "Seasonal", route: "/employee/seasonal" },
        ]}
      />
      <main className="flex-1">{children}</main>
    </>
    </TransactionProvider>
  );
}
