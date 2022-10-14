import React from "react";
import Logo from "../assets/ptbLogo.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="w-full flex justify-around items-center h-20 mx-auto my-4 px-4 text-red-600">
      <div className="w-[300px] h-[150px]">
        <img src={Logo} alt="premium trust" />
      </div>
      <ul className="flex">
        <li className="p-4 hover:border-b-2 hover:border-b-red-600 hover:font-bold">
          <Link to="/paywithid">Pay With Id</Link>
        </li>
        <li className="p-4 hover:border-b-2 hover:border-b-red-600 hover:font-bold">
          <Link to="/paywithoutid">Pay Without Id</Link>
        </li>
        <li className="p-4 hover:border-b-2 hover:border-b-red-600 hover:font-bold">
          <Link to="/paywithcode">Pay With Code</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
