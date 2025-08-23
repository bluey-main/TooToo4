import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/navbar/AdminNavbar";
import DriverSidebar from "../../components/Sidebar/DriverSidebar";

const DriversHome = () => {
  const [navTrigger, setNavTrigger] = useState(false);

  const handleNavbarTrigger = function () {
    setNavTrigger(!navTrigger);
  };
  return (
    <div>
      <div className="flex bg-[#fbfbfb] relative">
        <DriverSidebar toggle={handleNavbarTrigger} trigger={navTrigger} />

        <main className="w-full max-md:ml-0">
          <AdminNavbar
            navTrigger={navTrigger}
            handleNavbarTrigger={handleNavbarTrigger}
          />
          <div className="p-2 max-md:p-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DriversHome;