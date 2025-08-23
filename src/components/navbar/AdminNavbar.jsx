/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {BsSearch} from "react-icons/bs";
import { Link } from "react-router-dom";
import { Cross as Hamburger } from "hamburger-react";
import logo from "../../assets/newlogo.png";


const AdminNavbar = ({ navTrigger, handleNavbarTrigger }) => {
  const [isOpen, setOpen] = useState(false);
  const { pathname } = useLocation();
  const [showCategoriesNav, setShowCategoriesNav] = useState(true);
  useEffect(() => {
    if (pathname == "/" || pathname.includes("categories")) {
      setShowCategoriesNav(true);
    } else {
      setShowCategoriesNav(false);
    }
  }, [pathname]);

  

  return (
    <>
      <div className="max-lg:border-b sticky top-0 z-[90] border-b-black/20 bg-white p-3">
        <div  className="md:hidden flex items-center gap-3">
          <div>
            <Hamburger
              rounded
              size={24}
              toggled={navTrigger}
              toggle={handleNavbarTrigger}
            />
          </div>
          <Link to={"/"}>
            <img className="w-[170px] max-md:w-[150px]" src={logo} alt="" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default AdminNavbar;
