import React from "react";
import Logo from "../assets/ptbLogo.png";

const Navbar = () => {
  return (
    <div className="w-full flex justify-around items-center h-20 mx-auto my-4 px-4 text-red-600">
      <div className="w-[300px] h-[150px]">
        <img src={Logo} alt="premium trust" />
      </div>
      <div className="bg-[#FAFAFA] w-[250px] h-[50px] border border-red-600 font-semibold text-xl text-center p-2">
        Juliet Ohankwere
      </div>
    </div>
  );
};

export default Navbar;
