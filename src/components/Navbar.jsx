import React from "react";
import { NavLink } from "react-router-dom";
import Logo from "../assets/ptbLogo.png";

const Navbar = () => {
  const activeStyle = ({ isActive }) => {
    return {
      fontWeight: isActive ? "bold" : "normal",
      textDecoration: isActive ? "underline" : "none",
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
        <NavLink to="/paywithassessment" className="p-4" style={activeStyle}>
          Pay With Assessment
        </NavLink>
      </nav>
    </div>
  );
};

export default Navbar;
