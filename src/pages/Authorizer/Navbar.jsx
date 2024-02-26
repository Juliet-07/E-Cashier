import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/icon.png";
import { IoMdPerson } from "react-icons/io";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("Username"));
    if (user !== null || user !== undefined) {
      setUser(user);
    }
  }, []);
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <div className="w-full h-20 bg-white flex items-center justify-between px-20 border">
      <div className="w-[60px] h-[60px]">
        <img src={Logo} />
      </div>
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full border border-red-600 bg-slate-300 mx-2 text-white flex items-center justify-center">
          <IoMdPerson size={20} />
        </div>
        <p className="font-bold text-black font-mono">{user.name}</p>
      </div>
    </div>
  );
};

export default Navbar;
