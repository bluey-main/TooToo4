/*eslint-disable*/
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoIosNotifications } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import logo from "../../assets/logo.png";
import { MenuButton } from "../Buttons/MenuButton";
import { BsBell, BsCart3, BsHeart, BsHouse } from "react-icons/bs";
import { useAuth } from "@/context/AuthContext";
// My Profile Orders Liked items Notifications Log out

const menu = [
  {
    icon: <BsHouse className="text-base" />,
    title: "My Profile",
    link: "/profile",
  },
  {
    icon: <BsCart3 className="text-base" />,
    title: "Orders",
    link: "/orders",
  },
  {
    icon: <BsHeart className="text-base" />,
    title: "Liked items",
    link: "/liked-items",
  },
  {
    icon: <BsBell className="text-base" />,
    title: "Notifications",
    link: "/notifications",
  },
  {
    icon: <CiLogout className="text-base" />,
    title: "Log out",
    link: "/auth/login",
  },
];

export default function Sidebar({ showLogo = true }) {
  const [collapseShow, setCollapseShow] = useState("hidden");
  const {signOut}  = useAuth()
  const pathname = useLocation().pathname.split("/")[2];
  const [active, setactive] = useState(
    menu.findIndex((item) => item.link === `/${pathname}`) || 0
  );

  useLayoutEffect(() => {
    setactive(menu.findIndex((item) => item.link === `/${pathname}`));
  }, [pathname]);

  return (
    <>
      <nav
        className="md:left-0 md:block hidden  md:top-0 md:bottom-0 
      md:overflow-y-auto  md:flex-nowrap md:overflow-hidden border relative 
      bg-white  items-center justify-between md:w-[21.125rem] z-10
      "
      >
        {/* {showLogo && (
          <div className="p-8">
            <img src={logo} alt="logo" className="  mx-auto" />
          </div>
        )} */}

        {menu.map((item, index) => (
          <Link
            to={`${
              "/auth/login" === item.link ? item.link : `/account${item.link}`
            }`}
            key={index}
            onClick={async () => {
              if (item.title == "Log out") {
                await signOut();
              }
            }}
          >
            <MenuButton
              active={index === active}
              icon={item.icon}
              title={item.title}
              setactive={setactive}
              key={item.title}
              index={index}
            />
          </Link>
        ))}
      </nav>
    </>
  );
}
