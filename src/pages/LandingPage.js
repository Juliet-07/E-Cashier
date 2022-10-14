import React from "react";
import Typed from "react-typed";
import { Link } from "react-router-dom";
import Logo from "../assets/ptbLogo(1).png";
import Delta from "../assets/deltaState.png";
import Oyo from "../assets/oyoState.png";
import Oysstf from "../assets/Oysstf.jpeg";

const LandingPage = () => {
  return (
    <>
      <div className="bg-gradient-to-r from-black via-white to-red-600 w-full h-screen">
        <div className="w-[300px] h-[150px]">
          <img src={Logo} alt="premium trust" />
        </div>
        <div className="flex justify-center items-center">
          <p className="md:text-5xl sm:text-4xl text-xl font-bold py-4">
            Select Merchant for
          </p>
          <Typed
            className="md:text-5xl sm:text-4xl text-xl font-bold md:pl-4 pl-2"
            strings={["Delta State", "Oyo State", "&", "Ogun State"]}
            typeSpeed={100}
            backSpeed={120}
            loop
          />
        </div>
        <div className="flex items-center justify-center relative top-[180px]">
          <div className="w-[200px] h-[200px] m-10">
            <Link to="/paywithid">
              <img src={Delta} alt="/" />
            </Link>
          </div>
          <div className="w-[200px] h-[200px] m-10">
            <img src={Oyo} alt="/" />
          </div>
          <div className="w-[200px] h-[200px] m-10">
            <img src={Oysstf} alt="/" />
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
