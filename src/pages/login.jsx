import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import BGIMAGE from "../assets/bg-login.jpeg";
import Logo from "../assets/icon.svg";
import ECashLogo from "../assets/e-cashierLogo.png";

const Login = () => {
  const apiURL = import.meta.env.VITE_REACT_APP_AD_BASEURL;
  const baseURL = import.meta.env.VITE_REACT_APP_BASEURL;
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
    const url = `${apiURL}/ActiveDirectory/PTBAuthenticateUserOTP`;
    try {
      fetch(url, {
        method: "POST",
        body: JSON.stringify(loginDetails),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
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
  const url = `${baseURL}/GetUserDetail?UserID=${userName}`;
  const userRole = async () => {
    try {
      const response = await axios.get(url);
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
      <div
        className="w-full h-screen relative bg-cover"
        style={{
          backgroundImage: `url(${BGIMAGE})`,
        }}
      >
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-[#111111]/60 z-[2]"></div>
        <div className="flex items-center justify-between px-10 relative z-[3] pt-6">
          <div className="w-[68.72px] h-[68.72px]">
            <img src={Logo} alt="PTB" />
          </div>
          <div className="w-[100px] h-[100px]">
            <img src={ECashLogo} alt="E-cashier" />
          </div>
        </div>
        <div className="w-full flex items-center justify-center relative z-[3] p-20 mt-20">
          <div className="w-[500px] h-[450px] text-black flex flex-col bg-white rounded-xl p-10">
            <form
              onSubmit={handleSubmit(handleLoginValidation)}
              className="font-mono"
            >
              <div className="mt-4">
                <label
                  htmlFor="userName"
                  className="block text-sm text-gray-800"
                >
                  Username
                </label>
                <input
                  type="text"
                  className="block w-full h-[50px] px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-red-400 focus:ring-red-300 focus:outline-none focus:ring focus:ring-opacity-40"
                  name="userName"
                  value={userName}
                  onChange={handleChange}
                  required
                  placeholder="Enter firstname.lastname"
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
                  className="block w-full h-[50px] px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-red-400 focus:ring-red-300 focus:outline-none focus:ring focus:ring-opacity-40"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  placeholder="Enter profile password"
                />
              </div>
              <div className="mt-4">
                <label
                  htmlFor="password"
                  className="block text-sm text-gray-800"
                >
                  OTP
                </label>
                <input
                  type="text"
                  className="block w-full h-[50px] px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-red-400 focus:ring-red-300 focus:outline-none focus:ring focus:ring-opacity-40"
                  name="otp"
                  value={otp}
                  onChange={handleChange}
                  required
                  placeholder="Enter soft token"
                />
              </div>
              <div className="mt-10">
                <button
                  type="submit"
                  className="w-full h-[50px] px-4 py-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-red-700 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
                >
                  Log in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
