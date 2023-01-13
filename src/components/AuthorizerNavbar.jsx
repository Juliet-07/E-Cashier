import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/ptbLogo.png";

const Navbar = () => {
  const [user, setUser] = useState("");
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("Username"));
    if (user !== null || user !== undefined) {
      setUser(user);
    }
  }, []);
  return (
    <>
      <div className="w-full flex justify-between items-center h-20 mx-auto my-4 px-4 text-red-600 bg-white shadow-xl">
        <div className="w-[300px] h-[150px]">
          <img src={Logo} alt="premium trust" />
        </div>
        <div className="flex items-center">
          <div className="bg-[#FAFAFA] w-[250px] h-[50px] border border-red-600 font-semibold text-xl text-center p-2 mr-4">
            {user.name}
          </div>
          <Link to="/">
            <div className="text-xl font-bold mr-2">Logout</div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
