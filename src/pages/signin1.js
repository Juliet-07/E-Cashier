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
    userName: "",
    password: "",
    otp: "",
  };
  const [loginDetails, setLoginDetails] = useState(initialValues);
  const { userName, password, otp } = loginDetails;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails({ ...loginDetails, [name]: value });
  };

  // function to validate user through ActiveDirectory
  const handleLoginValidation = () => {
    try {
      fetch(
        "http://192.168.207.8:8080/api/ActiveDirectory/PTBAuthenticateUserOTP",
        {
          method: "POST",
          body: JSON.stringify(loginDetails),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      )
        .then((res) => res.json())
        .then((user) => {
          console.log(user, "confirm here");
          window.alert(user.message);
          let userDetail = JSON.stringify(user.data);
          localStorage.setItem("Username", userDetail);
          if (user.message) {
            userRole();
          } else alert("User does not exist");
        });
    } catch (error) {
      console.log(error);
    }
  };

  // function to check user role and route to specific page
  const userRole = async () => {
    try {
      const response = await axios.get(
        `http://192.168.201.53:8097/GetUserDetail?UserID=${userName}`
      );
      console.log(response.data.result);
      if (response.data.result.role === "INITIATOR") {
        return navigate("/landingpage");
      }
      if (response.data.result.role === "AUTHORISER") {
        return navigate("/authorizer");
      }
    } catch (error) {
      console.log(error);
    }
  };
  window.onload = () => {
    const passwordInput = document.getElementById("passwordInput");
    passwordInput.onpaste = (e) => e.preventDefault();
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
              <label htmlFor="userName" className="block text-sm text-gray-800">
                Username
              </label>
              <input
                type="text"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-red-400 focus:ring-red-300 focus:outline-none focus:ring focus:ring-opacity-40"
                name="userName"
                value={userName}
                onChange={handleChange}
                required
                maxLength="20"
              />
            </div>
            <div className="mt-4">
              <label
                htmlFor="passwordInput"
                className="block text-sm text-gray-800"
              >
                Password
              </label>
              <input
                id="passwordInput"
                type="password"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-red-400 focus:ring-red-300 focus:outline-none focus:ring focus:ring-opacity-40"
                name="password"
                value={password}
                onChange={handleChange}
                maxLength="20"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="password" className="block text-sm text-gray-800">
                OTP
              </label>
              <input
                type="text"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-red-400 focus:ring-red-300 focus:outline-none focus:ring focus:ring-opacity-40"
                name="otp"
                value={otp}
                onChange={handleChange}
                required
                maxLength="20"
              />
            </div>
            <div className="mt-20">
              <button
                type="submit"
                className="w-full px-4 py-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-red-700 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
