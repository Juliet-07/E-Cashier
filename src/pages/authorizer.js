import React from "react";
import { NavLink } from "react-router-dom";
import Navbar from "../components/AuthorizerNavbar";

const Authorizer = () => {
  return (
    <>
      <Navbar />
      <div className="flex justify-between items-center mt-10">
        <div className="flex">
          <div className="w-[160px] h-[50px] border border-yellow-300 text-center p-2 font-medium text-xl ml-4 bg-yellow-400">
            <NavLink>Pending</NavLink>
          </div>
          <div className="w-[160px] h-[50px] border border-green-300 text-center p-2 font-medium text-xl bg-green-500">
            Completed
          </div>
          <div className="w-[160px] h-[50px] border border-red-600 text-center p-2 font-medium text-xl bg-red-600">
            Declined
          </div>
        </div>
        <div>search me here</div>
      </div>
    </>
  );
};

export default Authorizer;
