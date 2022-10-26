import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Logo from "../assets/ptbLogo.png";
import ELogo from "../assets/e-cashierLogo.png";
import { Link, Route } from "react-router-dom";
import axios from "axios";
import LandingPage from "./LandingPage";
import Authorizer from "./authorizer";

const Signin = () => {
  const { handleSubmit } = useForm();
  const initialValues = {
    username: "",
    password: "",
  };
  const [loginDetails, setLoginDetails] = useState(initialValues);
  const { username, password } = loginDetails;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails({ ...loginDetails, [name]: value });
  };

  // function to validate user through ActiveDirectory
  const handleLoginValidation = () => {
    fetch(
      `http://192.168.207.8:8080/api/ActiveDirectory/AuthenticateUser?userName=${username}&password=${password}`,
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    ).then((response) => console.log(response, "response from login"));
  };
  // function to check user role and route to specific page
  const userRole = async () => {
    try {
      const response = await axios.get(
        "http://192.168.207.18:8091/GetUserDetail",
        { username: username }
      );
      console.log(response.data);
      // to-do: get user role from response.data
      if (response.data.role === "initiator") {
        return <Route path="/landingpage" element={<LandingPage />} />;
      }
      if (response.data.role === "authorizer") {
        return <Route path="/approver" element={<Authorizer />} />;
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <div className="w-full h-full">
      <img src={Logo} alt="PTB" className="w-[300px] h-[150px]" />
      <div className="flex flex-col items-center justify-center">
        <div className="m-4">
          <img src={ELogo} alt="eCashier" />
        </div>
        <div className="w-[500px] h-[500px] shadow-lg border border-red-600 px-[75px] py-[51px]">
          <form onSubmit={handleSubmit(handleLoginValidation)}>
            <div className="mt-4">
              <label htmlFor="username" className="block text-sm text-gray-800">
                Username
              </label>
              <input
                type="text"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-red-400 focus:ring-red-300 focus:outline-none focus:ring focus:ring-opacity-40"
                name="username"
                value={username}
                onChange={handleChange}
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
                name="password"
                value={password}
                onChange={handleChange}
              />
            </div>
            <div className="mt-20">
              {/* <Link to="/landingpage"> */}
              <button
                type="submit"
                className="w-full px-4 py-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-red-700 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
              >
                Login
              </button>
              {/* </Link> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
