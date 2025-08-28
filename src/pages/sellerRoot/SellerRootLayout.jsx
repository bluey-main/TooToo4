import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { Link, useLocation } from "react-router-dom";
import SideBar from "./SideBar";
import logo from "../../assets/logo.png";
import { Cross as Hamburger } from "hamburger-react";
// import { useUser } from "../../context/UserContext";
import toast from "react-hot-toast";
// import { BsArrowRight } from "bs-icons/bs";
import restricted from "../../assets/restricted.svg";
import { useAuth } from "@/context/AuthContext";
import { BsArrowRight } from "react-icons/bs";

const SellerRootLayout = () => {
  const location = useLocation();
  const { userDetails, user, loading } = useAuth(); // Add loading state if available
  const current_page = location.pathname.split("/")[2];
  const display_page = location.pathname.split("/");
  const navigate = useNavigate();
  const [navTrigger, setNavTrigger] = useState(false);

  const handleNavbarTrigger = function () {
    setNavTrigger(!navTrigger);
  };

  // Handle default dashboard redirect
  useEffect(() => {
    if (location.pathname === "/seller") {
      navigate("dashboard");
    }
  }, [location.pathname, navigate]);

  // Handle authentication and role-based access
  useEffect(() => {

    console.log("from sellerrootlayout")
    // Don't run redirect logic if we're still loading user data
    if (loading) return;

    // If no user is logged in, redirect to login
    if (!user) {
      navigate("/auth/login");
      return;
    }

    // If user is logged in but userDetails isn't loaded yet, wait
    if (!userDetails) return;

    // If user is logged in but not a seller, redirect to profile
    if (userDetails.role !== "seller") {
      navigate("/account/profile");
      toast.error("You have to be a seller to access seller's panel.");
      return;
    }

    // If we reach here, user is a valid seller - no redirect needed
  }, [user, userDetails, loading,]);

  // Show loading state while checking authentication
  if (loading || (user && !userDetails)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#086047] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render the layout if user is not authenticated or not a seller
  if (!user || (userDetails && userDetails.role !== "seller")) {
    return null;
  }

  return (
    <React.Fragment>
      <div className="border-b p-3 bg-white sticky top-0 z-10 md:hidden">
        <div className="flex items-center gap-2">
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
      <div className="flex bg-[#fbfbfb] relative">
        <SideBar toggle={handleNavbarTrigger} trigger={navTrigger} />

        <main className="w-full max-md:ml-0">
          <div className="p-5 max-md:p-3">
            <header
              className={` items-center flex justify-between px-3 ${
                display_page.length === 3 && "py-5"
              }  max-md:pt-3`}
            >
              <p className=" md:text-2xl font-medium font-sans text-slate-700 capitalize">
                {display_page.length === 3 && current_page}
              </p>
            </header>
            {userDetails?.is_restricted ? (
              <div className="w-full h-full flex flex-col items-center gap-4">
                <img className="w-72 h-72" src={restricted} alt="" />
                <div className="flex items-center flex-col gap-1">
                  <h1 className="font-bold text-2xl">You Are Restricted</h1>
                  <Link
                    to={"/"}
                    className="flex items-center gap-2 text-[#086047] text-lg font-semibold"
                  >
                    <span>Contact Admin</span>
                    <BsArrowRight />
                  </Link>
                </div>
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </main>
      </div>
    </React.Fragment>
  );
};

export default SellerRootLayout;