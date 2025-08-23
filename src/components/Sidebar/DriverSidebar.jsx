/*eslint-disable*/
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { MenuButton } from "../Buttons/MenuButton";
import {
  BsBag,
  BsBell,
  BsCart3,
  BsHeart,
  BsHouse,
  BsPeople,
  BsShop,
  BsShopWindow,
  BsWallet,
  BsWallet2,
} from "react-icons/bs";
// My Profile Orders Liked items Notifications Log out

const menu = [
  {
    icon: <BsHouse className="text-base" />,
    title: "Dashboard",
    link: "/dashboard",
  },
  {
    icon: <BsHeart className="text-base" />,
    title: "RideHistory",
    link: "/ridehistory",
  },
  {
    icon: <BsPeople className="text-base" />,
    title: "Avaliable Rides",
    link: "/availablerides",
  },
  {
    icon: <BsWallet2 className="text-base" />,
    title: "Wallet",
    link: "/wallet",
  },
];

export default function DriverSidebar({ showLogo = true, trigger, toggle }) {
  const className =
    "bg-white w-[250px] max-md:w-[270px] transition-[margin-left] ease-in-out duration-[500ms] z-40";

  const appendClass = trigger ? "ml-0" : "ml-[-800px] md:ml-0";

  const ModalOverlay = () => (
    <div
      className={`flex md:hidden fixed top-0 right-0 bottom-0 left-0 bg-black/50 z-[99999]`}
      onClick={() => {
        toggle((oldVal) => !oldVal);
      }}
    />
  );

  const [collapseShow, setCollapseShow] = useState("hidden");
  const pathname = useLocation().pathname.split("/")[2];
  const [active, setactive] = useState(
    menu.findIndex((item) => item.link === `/${pathname}`) || 0
  );

  useLayoutEffect(() => {
    setactive(menu.findIndex((item) => item.link === `/${pathname}`));
    if (trigger) {
      toggle((oldVal) => !oldVal);
    }
  }, [pathname]);

  return (
    <>
      <aside
        className={`${className} ${appendClass} z-[999999] h-screen sticky top-0 max-md:fixed max-md:w-[65%] border-r text-white`}
      >
        {showLogo && (
          <div className="p-10 px-11">
            <Link to={"/"}>
              <img src={logo} alt="logo" className="mx-auto" />
            </Link>
          </div>
        )}

        {menu.map((item, index) => (
          <Link
            to={`${
              "/auth/login" === item.link ? item.link : `/driver${item.link}`
            }`}
            key={index}
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
      </aside>
      {trigger ? <ModalOverlay /> : <></>}
    </>
  );
}
