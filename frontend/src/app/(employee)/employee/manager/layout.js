import "../../../globals.css";
import EmployeeNavbar from "@/components/EmployeeNavbar";

export default function ManagerLayout({ children }) {
  return (
    <>
      <EmployeeNavbar
        links={[
          { name: "Feature 1", route: "/employee/manager/inventory" },
          { name: "Feature 2", route: "/employee/manager/" },
          { name: "Feature 3", route: "/employee/manager/" },
          { name: "Feature 4", route: "/employee/manager/" },
          { name: "Feature 5", route: "/employee/manager/" },
          { name: "Feature 6", route: "/employee/manager/" },
        ]}
      ></EmployeeNavbar>
      <main className="flex-1">{children}</main>
    </>
  );
}
