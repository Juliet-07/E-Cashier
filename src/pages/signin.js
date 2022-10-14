import React, { useState } from "react";
import Logo from "../assets/ptbLogo.png";
import ELogo from "../assets/e-cashierLogo.png";
import { Link } from "react-router-dom";

const Signin = () => {
  return (
    <div className="w-full h-full">
      <img src={Logo} alt="PTB" className="w-[300px] h-[150px]" />
      <div className="flex flex-col items-center justify-center">
        {/* <h2 className="my-4 text-3xl font-bold">E-Cashier Application</h2> */}
        <div className="m-4">
          <img src={ELogo} alt="eCashier" />
        </div>
        <div className="w-[500px] h-[550px] shadow-lg border border-red-600 px-[75px] py-[51px]">
          <form>
            <div className="mt-4">
              <label htmlFor="email" className="block text-sm text-gray-800">
                Email
              </label>
              <input
                type="email"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-red-400 focus:ring-red-300 focus:outline-none focus:ring focus:ring-opacity-40"
                required
              />
            </div>
            <div className="mt-4">
              <label htmlFor="password" className="block text-sm text-gray-800">
                Password
              </label>
              <input
                type="password"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-red-400 focus:ring-red-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
            <div className="mt-20">
              <Link to="/landingpage">
                <button
                  type="button"
                  className="w-full px-4 py-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-red-700 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
                >
                  Login
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
