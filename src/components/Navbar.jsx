import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import Logo from "../assets/ptbLogo.png";
import {
  encryptPayload,
  decryptPayload,
} from "../shared/services/e-cashier-encryption.service";
import AsyncSelect from "react-select/async";

const Navbar = () => {
  const [inputValue, setValue] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);

  const handleInputChange = (value) => {
    setValue(value);
  };

  const handleChange = (value) => {
    setSelectedValue(value);
  };

  const activeStyle = ({ isActive }) => {
    return {
      fontWeight: isActive ? "bold" : "normal",
      textDecoration: isActive ? "underline" : "none",
    };
  };
  // function for the entire api flow;{encryption, getData, decryption}
  const handleRequest = async () => {
    let result;
    await encryptPayload({
      BranchCode: "XPS",
    }).then(async (response) => {
      result = await getPaymentOptions(response.data);
      console.log({ result });
    });
    return result;
  };

  // function to getData for available Merchants
  const getPaymentOptions = async (searchParams) => {
    const url = `http://80.88.8.239:9011/api/ApiGateway/GetPaymentOptions?request=${searchParams}`;
    let result;
    await axios
      .get(url)
      .then(async (response) => {
        // console.log(response.data);
        result = await handleDecrypt(response.data.data);
      })
      .catch((error) => console.log(error));
    return result;
  };

  // function to decrypt encrypted data
  const handleDecrypt = async (encryptedData) => {
    let result;
    await decryptPayload(encryptedData).then((decryptResponse) => {
      // console.log("logging decrypted response", decryptResponse);
      decryptResponse.data = JSON.parse(decryptResponse.data);
      result = decryptResponse.data;
      console.log(result);
    });
    return result;
  };

  // const savePaymentOptionDetails = () => {
  //   localStorage.setItem("PaymentOption", JSON.stringify(getPaymentOptions));
  // };
  return (
    <div className="w-full flex justify-around items-center h-20 mx-auto my-4 px-4 text-red-600">
      <div className="w-[300px] h-[150px]">
        <img src={Logo} alt="premium trust" />
      </div>
      {/* <div className="flex items-center justify-center">
        <div className="w-[500px]">
          <AsyncSelect
            cacheOptions
            defaultOptions
            value={selectedValue}
            getOptionLabel={(e) => e.PaymentOptionName}
            getOptionValue={(e) => e.PaymentOptionId}
            loadOptions={handleRequest}
            onInputChange={handleInputChange}
            onChange={handleChange}
            placeholder="Select Payment Option"
          />
        </div>
        <div>
          <button
            onClick={savePaymentOptionDetails}
            type="submit"
            className="text-white bg-red-600 hover:bg-red-700 hover:font-bold font-medium text-sm p-2.5 text-center w-[100px]"
          >
            OK
          </button>
          <div className="bg-red-700"></div>
        </div>
      </div> */}

      <nav>
        <NavLink to="/paywithid" className="p-4" style={activeStyle}>
          Pay With Id
        </NavLink>
        <NavLink to="/paywithoutid" className="p-4" style={activeStyle}>
          Pay Without Id
        </NavLink>
        <NavLink to="/paywithcode" className="p-4" style={activeStyle}>
          Pay With Code
        </NavLink>
      </nav>
      {/* <ul className="flex">
        <li className="p-4 hover:border-b-2 hover:border-b-red-600 hover:font-bold">
          <NavLink to="/paywithid">Pay With Id</NavLink>
        </li>
        <li className="p-4 hover:border-b-2 hover:border-b-red-600 hover:font-bold">
          <NavLink to="/paywithoutid">Pay Without Id</NavLink>
        </li>
        <li className="p-4 hover:border-b-2 hover:border-b-red-600 hover:font-bold">
          <NavLink to="/paywithcode">Pay With Code</NavLink>
        </li>
      </ul> */}
    </div>
  );
};

export default Navbar;
