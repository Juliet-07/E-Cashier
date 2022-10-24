import React from "react";
import Logo from "../assets/ptbLogo.png";
import { NavLink } from "react-router-dom";
import "../../src/index.css";

const Navbar = () => {
  const activeStyle = ({ isActive }) => {
    return {
      fontWeight: isActive ? "bold" : "normal",
      textDecoration: isActive ? "underline" : "none",
      // color: isActive ? "green" : "normal",
    };
  };
  return (
    <div className="w-full flex justify-around items-center h-20 mx-auto my-4 px-4 text-red-600">
      <div className="w-[300px] h-[150px]">
        <img src={Logo} alt="premium trust" />
      </div>
      <nav>
        <NavLink to="/paywithid" className="p-4" style={activeStyle}>
          Pay With Id
        </NavLink>
        <NavLink to="/paywithoutid" className="p-4" style={activeStyle}>
          Pay Without Id
        </NavLink>
        <NavLink to="/paywithcode" className="p-4" style={activeStyle}>
          Pay With Code
        </NavLink>
      </nav>
      {/* <ul className="flex">
        <li className="p-4 hover:border-b-2 hover:border-b-red-600 hover:font-bold">
          <NavLink to="/paywithid">Pay With Id</NavLink>
        </li>
        <li className="p-4 hover:border-b-2 hover:border-b-red-600 hover:font-bold">
          <NavLink to="/paywithoutid">Pay Without Id</NavLink>
        </li>
        <li className="p-4 hover:border-b-2 hover:border-b-red-600 hover:font-bold">
          <NavLink to="/paywithcode">Pay With Code</NavLink>
        </li>
      </ul> */}
    </div>
  );
};

export default Navbar;
