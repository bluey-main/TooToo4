/* eslint-disable react/prop-types */
import  { useLayoutEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { Link,  useLocation } from "react-router-dom";
import { BsHouse, BsPerson } from "react-icons/bs";
import { CiShop, CiShoppingBasket, CiWallet } from "react-icons/ci";
import { MenuButton } from "../../components/Buttons/MenuButton";

function SideBar({ trigger, toggle }) {
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

  const menu = [
    { icon: <BsHouse className="text-lg" />, page: "dashboard" },
    { icon: <CiShoppingBasket className="text-xl" />, page: "orders" },
    { icon: <CiShop className="text-xl" />, page: "products" },
    { icon: <CiWallet className="text-xl" />, page: "wallet" },
    { icon: <BsPerson className="text-xl" />, page: "profile" },
  ];

  const pathname = useLocation().pathname.split("/")[2];
  const [active, setactive] = useState(
    menu.findIndex((item) => item.page === `${pathname}`) || 0
  );

  useLayoutEffect(() => {
    setactive(menu.findIndex((item) => item.page === `${pathname}`));
    if (trigger) {
      toggle((oldVal) => !oldVal);
    }
  }, [pathname]);
  return (
    <>
      <aside
        className={`${className} ${appendClass} z-[999999] h-screen sticky top-0 max-md:fixed max-md:w-[65%] border-r text-white`}
      >
        <div className="p-10 px-11">
          <Link to={"/"}>
            <img src={logo} alt="logo" className="mx-auto" />
          </Link>
        </div>

        {menu.map((item, index) => (
          <Link
            to={`${
              "/auth/login" === item.link ? item.link : `/seller/${item.page}`
            }`}
            key={index}
          >
            <MenuButton
              active={index === active}
              icon={item.icon}
              title={item.page}
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

export default SideBar;
