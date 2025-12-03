import React, { useEffect, useState } from "react";
import Nepaldropdownitem from "./Nav_dropdown/Nepaldropdownitem";
import Indiadropdownitem from "./Nav_dropdown/Indiadropdownitem";

import "./Navbar.scss";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-20 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="navbar bg-white/30 backdrop-blur-sm border-0 px-8 py-5 font-bebas flex justify-center sticky transition-all duration-300 top-0 z-99">
        <div className="absolute left-5 top-1 bottom-1 flex items-center h-15 px-4">
          <Link to="/" className="text-lg cursor-pointer">
            <img src="/wtalogo1.ico" alt="logo" className="h-15" />
          </Link>
        </div>

        {/* Desktop Navbar */}
        <div className="md:flex gap-16 font-bebas-neue text-xl items-center  hidden ">
          <Link
            to={"/"}
            className="flex cursor-pointer text-black hover:text-[#fdb913] transition-normal duration-300"
          >
            Home
          </Link>

          <div className="dropdown dropdown-center">
            <div
              tabIndex={0}
              role="button"
              className="flex cursor-pointer text-black hover:text-[#fdb913] transition-normal duration-300"
            >
              Nepal
            </div>
            <Nepaldropdownitem />
          </div>

          <div className="dropdown dropdown-center">
            <div
              tabIndex={0}
              className="flex cursor-pointer text-black hover:text-[#fdb913] transition-normal duration-300"
            >
              India
            </div>

            <Indiadropdownitem />
          </div>

          <a
            href="#Bhutan"
            className="flex cursor-pointer text-black hover:text-[#fdb913] transition-normal duration-300"
          >
            Bhutan
          </a>
          <Link
            to={"/aboutus"}
            className="flex cursor-pointer text-black hover:text-[#fdb913] transition-normal duration-300"
          >
            About Us
          </Link>

          <Link
            to="/contactus"
            className="flex cursor-pointer text-black hover:text-[#fdb913] transition-normal duration-300"
          >
            Contact
          </Link>
        </div>

        {/* Mobile Navbar */}
      </div>
    </nav>
  );
};

export default NavBar;
