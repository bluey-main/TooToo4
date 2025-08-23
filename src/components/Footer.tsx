import logo from "../assets/newlogo.png";
import { Link } from "react-router-dom";
import { BsFacebook, BsInstagram } from "react-icons/bs";
import React from "react";

const Footer: React.FC = () => {
  return (
    <>
      <footer className="bg-[#086047]">
        <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
          <div className="md:flex md:justify-between">
            <div className="mb-6 md:mb-0">
              <Link to={"/"} className="flex items-center">
                <img
                  src={logo}
                  className=" w-52  brightness-0 invert"
                  alt="Jamazan Logo"
                />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-2">
              <div>
                <h2 className="mb-6 text-sm font-semibold text-white">
                  Resources
                </h2>
                <ul className="text-white/70 text-sm  font-medium">
                  <li className="mb-4">
                    <Link
                      to="/"
                      className="hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/"
                      className="hover:underline"
                    >
                      Help Center
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="mb-6 text-sm font-semibold text-white">Legal</h2>
                <ul className="text-white/70 text-sm  font-medium">
                  <li className="mb-4">
                    <a href="#" className="hover:underline">
                      Contact Support
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline">
                      Terms &amp; Conditions
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <hr className="my-6 border-white/20 sm:mx-auto lg:my-8" />
          <div className="sm:flex sm:items-center sm:justify-between">
            <span className="text-sm text-white/50 sm:text-center">
              © 2024{" "}
              <Link to={"/"} className="hover:underline">
                Jamazan
              </Link>
              . All Rights Reserved.
            </span>
            <div className="flex mt-4 gap-5 sm:justify-center sm:mt-0">
              <a href="#" className="text-white/80 hover:text-white/100">
                <BsFacebook />
                <span className="sr-only">Facebook page</span>
              </a>
              <a href="#" className="text-white/80 hover:text-white/100">
                <BsInstagram />
                <span className="sr-only">Instagram page</span>
              </a>
              <a href="#" className="text-white/80 hover:text-white/100">
                <BsFacebook />
                <span className="sr-only">Facebook page</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

