import EmployeeNavbar from "@/components/EmployeeNavbar";
import "../../../globals.css";
import { TransactionProvider } from "@/components/transactions/TransactionContext";

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
