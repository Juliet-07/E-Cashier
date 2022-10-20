import React, { useState } from "react";
import Typed from "react-typed";
import { Link } from "react-router-dom";
import Logo from "../assets/ptbLogo(1).png";
import Delta from "../assets/deltaState.png";
import Oyo from "../assets/oyoState.png";
import Oysstf from "../assets/Oysstf.jpeg";
import AsyncSelect from "react-select/async";
import axios from "axios";
import {
  encryptPayload,
  decryptPayload,
} from "../shared/services/e-cashier-encryption.service";

const LandingPage = (data) => {
  const [inputValue, setValue] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);
  const handleInputChange = (value) => {
    setValue(value);
  };
  const handleChange = (value) => {
    setSelectedValue(value);
  };
  const handleRequest = () => {
    encryptPayload({
      BranchCode: "XPS",
    }).then((response) => {
      console.log(response.data);
      getAvailableMerchants(response.data);
    });
  };
  const getAvailableMerchants = (searchParams) => {
    const url = `http://80.88.8.239:9011/api/ApiGateway/GetAvailableMerchants?request=${searchParams}`;
    axios
      .get(url)
      .then((response) => {
        console.log(response.data);
        return handleDecrypt(response.data.data);
      })
      .catch((error) => console.log(error));
  };
  const handleDecrypt = (encryptedData) => {
    decryptPayload(encryptedData).then((decryptResponse) => {
      console.log("logging decrypted response", decryptResponse);
    });
  };
  return (
    <>
      <div className="bg-gradient-to-r from-black via-white to-red-600 w-full h-screen">
        <div className="w-[300px] h-[150px]">
          <img src={Logo} alt="premium trust" />
        </div>
        <div
          className="text-white font-semibold text-2
        xl m-4"
        >
          Welcome Juliet
        </div>
        <div className="flex justify-center items-center">
          <p className="text-xl font-bold py-4">Please Select Merchant for</p>
          <Typed
            className="text-xl font-bold md:pl-4 pl-2"
            strings={["Delta State", "Oyo State", "&", "Ogun State"]}
            typeSpeed={100}
            backSpeed={120}
            loop
          />
        </div>
        <div className="text-black font-bold text-xl flex items-center justify-center mb-4">
          Selected Value:{JSON.stringify(selectedValue || {}, null, 2)}
        </div>
        <div className="flex items-center justify-center">
          <AsyncSelect
            cacheOptions
            defaultOptions
            value={selectedValue}
            getOptionLabel={(e) => e.merchantName}
            getOptionValue={(e) => e.id}
            loadOptions={handleRequest}
            onInputChange={handleInputChange}
            onChange={handleChange}
          />
          <div>
            <div className="bg-red-700"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
