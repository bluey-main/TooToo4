import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  BsBell,
  BsCart3,
  BsChevronDown,
  BsHeart,
  BsHouse,
  BsPerson,
  BsQuestionCircle,
  BsSearch,
  BsX,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import { Cross as Hamburger } from "hamburger-react";
import logo from "../../assets/newlogo.png";
import logo2 from "../../assets/newlogo_resized.png";
import { useLocation, useNavigate } from "react-router";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
// import { useUser } from "../../context/UserContext";
// import { useSeller } from "../../context/SellerContext";
import { useCart } from "../../context/CartContext";
import { MenuButton } from "../Buttons/MenuButton";
import { CiLogout } from "react-icons/ci";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { iOS } from "../../utils/helper";
import { ChangeEvent, KeyboardEvent } from "react";
import { SellerContext, useSeller } from "@/context/SellerContext";
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

// Assuming types for these:
type ProductName = string;
type GetAllProductsNamesFn = () => Promise<ProductName[]>;

const NavBar = () => {
  const { user, userDetails, signOut } = useAuth();
  const [isOpen, setOpen] = useState(false);
  const { categories } = useSeller();
  const { pathname } = useLocation();
  const [showCategoriesNav, setShowCategoriesNav] = useState(true);
  const isMobile = useMediaQuery("(min-width: 768px)");
  const { cartItems } = useCart();
  const [active, setactive] = useState(
    menu.findIndex((item) => item.link === `/${pathname.split("/")[2]}`) || 0
  );
  const [search, setSearch] = useState("");
  const [allProductsNames, setAllProductsNames] = useState<string[]>([]);
  const [filteredResults, setFilteredResults] = useState<string[]>([]);
  const [showSuggestion, setShowSuggestion] = useState<boolean>(false);

  useLayoutEffect(() => {
    setactive(
      menu.findIndex((item) => item.link === `/${pathname.split("/")[2]}`)
    );

    if (isOpen) {
      setOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (pathname == "/" || pathname?.includes("categories")) {
      setShowCategoriesNav(true);
    } else {
      setShowCategoriesNav(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (isMobile && isOpen) {
      setOpen(false);
    }
  }, [isMobile, isOpen]);

  const navigate = useNavigate();

  const fetchAllProductNames = useCallback(async (): Promise<void> => {
    try {
      if (allProductsNames.length > 0) {
        setShowSuggestion(true);
        return;
      }

      const { data, error } = await supabase.from("products").select("name");
      if (error) {
        throw error;
      }
      const productNames = data.map((product) => product.name);
      console.log(productNames);
      setAllProductsNames(productNames);
      setShowSuggestion(true);
    } catch (error) {
      console.error("Error fetching product names:", error);
    }
  }, [allProductsNames]);

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && search !== "") {
      navigate(`/search/${search}`);
    }
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearch(query);
    if (query.length > 0) {
      const results = allProductsNames.filter((product) =>
        product.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredResults(results);
    } else {
      setFilteredResults([]);
    }
  };

  const highlightMatch = (
    text: string,
    query: string
  ): (string | JSX.Element)[] => {
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <strong key={index} className="text-[#086047]">
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  return (
    <>
      <div className="border-b sticky top-0 z-[90] border-b-black/20 bg-white">
      {/* <div>
      <p>{user?.email}</p>
      <p>{userDetails?.email}</p>
      <p>{userDetails?.username}</p>
      <button onClick={() => signOut()}>logout</button>
      </div> */}


        <div className="flex items-center justify-between p-4 py-5 sticky top-0 container mx-auto gap-10">
          <div className="w-[15%] max-md:w-fit flex items-center gap-10">
            <div className="md:hidden">
              <Hamburger rounded size={24} toggled={isOpen} toggle={setOpen} />
            </div>
            <Link to={"/"}>
              <div
                className="  md:w-[8rem] md:h-[6rem] w-[12rem] h-[4rem]"
                style={{
                  backgroundImage: `url(${logo})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  scale: "1.3",
                }}
              ></div>
            </Link>
          </div>
          <div className="flex items-center gap-5 md:hidden">
            <Link to={"/account/profile"}>
              <BsPerson size={21} />
            </Link>
            <Link to={"/cart"}>
              <span className="relative">
                <BsCart3 size={21} />
                {!iOS() && cartItems?.length > 0 && (
                  <div className="bg-[#086047] text-[8px] font-bold text-white w-[17px] h-[17px] flex items-center justify-center rounded-full border-2 border-white absolute -top-1 -right-1.5">
                    {cartItems?.length}
                  </div>
                )}
              </span>
            </Link>
          </div>
          <div className="md:w-[85%] flex items-center gap-4 md:gap-6">
            <div className="w-full">
              <div className="hidden sm:flex border border-[#086047] bg-[#086047] overflow-hidden rounded-md w-full">
                <input
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search for products, stores and categories"
                  className="p-3 px-4 text-sm w-full outline-none"
                  onKeyDown={handleKeyPress}
                  onFocus={() => {
                    fetchAllProductNames();
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowSuggestion(false), 200); // Delay hiding
                  }}
                />
                <div
                  className="flex items-center justify-center px-5 text-lg cursor-pointer hover:opacity-70"
                  onClick={() => {
                    if (search !== "") {
                      navigate(`/search/${search}`);
                    }
                  }}
                >
                  <BsSearch className="text-white h-full" />
                </div>
              </div>

              {(filteredResults.length > 0 && showSuggestion) && (
                  <ul className="absolute bg-white border lg:mt-1 mt-20 rounded-md shadow-lg max-h-60 w-96  overflow-y-auto left-1/2 transform -translate-x-1/2">
                    {filteredResults.map((result, index) => (
                      <li
                        key={index}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSearch(result)
                          navigate(`/search/${result}`)
                          setShowSuggestion(false)
                        }}
                      >
                        {highlightMatch(result, search)}
                      </li>
                    ))}
                  </ul>
                )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm cursor-pointer hover:bg-black/[5%] rounded-md p-2 px-3">
                <BsQuestionCircle />
                <p>Help</p>
                <BsChevronDown />
              </div>

              {user ? (
                <Link
                  className="flex items-center gap-3 text-sm cursor-pointer hover:bg-black/[5%] rounded-md p-2 px-3"
                  to={"/account/profile"}
                >
                  <BsPerson size={16} />
                  <p>Account</p>
                </Link>
              ) : (
                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button className="flex items-center gap-2 text-sm cursor-pointer hover:bg-black/[5%] rounded-md p-2 px-3">
                    <BsPerson size={16} />
                    <p>Account</p>
                    <BsChevronDown />
                  </Menu.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                      <div className="px-2 py-2 ">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => navigate("/auth/login")}
                              className={`${
                                active
                                  ? "bg-[#086047] text-white"
                                  : "text-gray-900"
                              } group flex w-full items-center rounded-md px-4 py-2 text-sm`}
                            >
                              Login
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => navigate("/auth/register")}
                              className={`${
                                active
                                  ? "bg-[#086047] text-white"
                                  : "text-gray-900"
                              } group flex w-full mt-1 items-center rounded-md px-4 py-2 text-sm`}
                            >
                              Register
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              )}
              <Link to={"/cart"}>
                <div className="flex items-center gap-3 text-sm cursor-pointer hover:bg-black/[5%] rounded-md p-2 px-3">
                  <span className="relative">
                    <BsCart3 size={17} />
                    {cartItems?.length > 0 && (
                      <div className="bg-[#086047] text-[8px] font-bold text-white w-[15px] h-[15px] flex items-center justify-center rounded-full border-2 border-white absolute -top-1 -right-1.5">
                        {cartItems?.length}
                      </div>
                    )}
                  </span>
                  <p>Cart</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          unmount={false}
          className="relative z-[99999999] lg:hidden"
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
                <div className="flex items-center justify-between px-6 py-4">
                  <Link onClick={() => setOpen(false)} to={"/"}>
                    <img
                      className="w-[170px] max-md:w-[150px]"
                      src={logo2}
                      alt=""
                    />
                  </Link>
                  <button
                    type="button"
                    className="relative -mr-2 flex h-10 w-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500"
                    onClick={() => setOpen(false)}
                  >
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Close menu</span>
                    <BsX className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-6">
                  <p className="px-6 border-t py-4 uppercase text-sm tracking-wider opacity-70">
                    My Jamazan Account
                  </p>
                  {menu.map((item, index) =>
                    item.title == "Log out" ? (
                      user ? (
                        <div
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
                        </div>
                      ) : null
                    ) : (
                      <Link
                        to={`${
                          "/auth/login" === item.link
                            ? item.link
                            : `/account${item.link}`
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
                    )
                  )}
                </div>
                {!user && (
                  <div className="mt-6 border-t px-[30px] py-4">
                    <Link
                      to="/auth/login"
                      className="flex w-full justify-center rounded-md bg-p px-3 py-3 text-sm font-semibold bg-white border leading-6 text-[#086047] shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 items-center disabled:opacity-50 "
                    >
                      Login to your account
                    </Link>
                    <Link
                      to="/auth/register"
                      className="flex w-full justify-center rounded-md bg-p px-3 py-3 text-sm font-semibold bg-[#086047] leading-6 text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 items-center disabled:opacity-50 mt-4"
                    >
                      Create an account
                    </Link>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      {showCategoriesNav && (
        <div className="border-b border-b-black/20 bg-white overflow-auto whitespace-nowrap">
          <div className="flex items-center justify-between p-4 py-4 max-w-[1280px] mx-auto text-[13px] text-[#086047] gap-4 ">
            {categories?.length < 1
              ? Array.from({ length: 10 }).map((id, index) => {
                  return (
                    <div
                      key={index}
                      className="w-[60px] rounded-sm h-[15px] animate-pulse bg-black/[7%]"
                    ></div>
                  );
                })
              : categories?.map((category, index) => {
                  return (
                    <Link
                      to={`/categories/${category?.name?.toLowerCase()}`}
                      key={index}
                      className=" text-[#086047] transition-all duration-500 ease-in-out"
                    >
                      {category?.name}
                    </Link>
                  );
                })}
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
