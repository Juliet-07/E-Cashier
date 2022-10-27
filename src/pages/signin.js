import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Logo from "../assets/ptbLogo.png";
import ELogo from "../assets/e-cashierLogo.png";

const Signin = () => {
  const navigate = useNavigate();
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
    )
      .then((response) => {
        console.log(response, "checking");
        if (response.status === 200) {
          userRole();
        } else alert("User does not exist");
      })
      .catch((error) => console.log(error));
  };

  // function to check user role and route to specific page
  const userRole = async () => {
    try {
      const response = await axios.get(
        `http://192.168.207.18:8091/GetUserDetail?UserID=${username}`
      );
      console.log(response.data.result);
      let user = response.data.result[0].userR_NAME;
      console.log(user);
      // localStorage.setItem("Username", JSON.stringify(user));
      // to-do: get user role from response.data
      if (
        response.data.result.length &&
        response.data.result[0].role === "INITIATOR"
      ) {
        return navigate("/landingpage");
      }
      if (
        response.data.result.length &&
        response.data.result[0].role === "AUTHORISER"
      ) {
        return navigate("/authorizer");
      }
    } catch (error) {
      console.log(error);
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
