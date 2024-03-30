import EmployeeNavbar from "@/components/EmployeeNavbar";
import "../../../globals.css";

export default function CategoryLayout({ children }) {
  return (
    <>
      <EmployeeNavbar
        links={[
          { name: "Burgers", route: "/employee/burgers" },
          { name: "Tenders", route: "/employee/tenders" },
          { name: "Dogs", route: "/employee/dogs" },
          { name: "Ice Cream", route: "/employee/ice-cream" },
          { name: "Beverages", route: "/employee/beverages" },
          { name: "Seasonal", route: "/employee/seasonal" },
        ]}
      />
      <main className="flex-1">{children}</main>
    </>
  );
}
