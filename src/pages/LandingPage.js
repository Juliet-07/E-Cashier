import React, { useState, useEffect } from "react";
import axios from "axios";
import AsyncSelect from "react-select/async";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/ptbLogo(1).png";
import Typed from "react-typed";
import {
  encryptPayload,
  decryptPayload,
} from "../shared/services/e-cashier-encryption.service";

const LandingPage = () => {
  const [inputValue, setValue] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (value) => {
    setValue(value);
  };

  const handleChange = (value) => {
    setSelectedValue(value);
  };

  const [user, setUser] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("Username"));
    if (user !== null || user !== undefined) {
      setUser(user);
    }
  }, []);

  // function for the entire api flow;{encryption, getData, decryption}
  const handleRequest = async (inputValue) => {
    // console.log({ inputValue });
    let result;
    await encryptPayload({
      BranchCode: "001",
    }).then(async (response) => {
      result = await getAvailableMerchants(response.data);
      console.log({ result });
    });
    return result;
  };

  // function to getData for available Merchants
  const getAvailableMerchants = async (searchParams) => {
    const url = `https://test.xpresspayments.com:9015/api/ApiGateway/GetAvailableMerchants?request=${searchParams}`;
    let result;
    await axios
      .get(url)
      .then(async (response) => {
        result = await handleDecrypt(response.data.data);
      })
      .catch((error) => console.log(error));
    return result;
  };

  // function to decrypt encrypted data
  const handleDecrypt = async (encryptedData) => {
    let result;
    await decryptPayload(encryptedData).then((decryptResponse) => {
      decryptResponse.data = JSON.parse(decryptResponse.data);
      result = decryptResponse.data;
      console.log(result);
    });
    return result;
  };

  // function to save merchant details
  const saveMerchantDetails = () => {
    if (selectedValue !== null) {
      localStorage.setItem("Merchant", JSON.stringify(selectedValue));
      return navigate("/paywithid");
    }
    return alert("Please select Merchant");
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };
  
  return (
    <>
      <div className="bg-gradient-to-r from-black to-red-600 w-full h-screen">
        <div className="w-[300px] h-[150px]">
          <img src={Logo} alt="premium trust" />
        </div>
        <div className="flex items-center justify-between">
          <div
            className="text-white font-semibold text-2
        xl mx-4"
          >
            Welcome {user.name}
          </div>
          <div className="mx-4">
            <button
              onClick={logout}
              type="submit"
              className="text-white bg-black font-bold text-sm p-2.5 text-center w-[100px]"
            >
              Logout
            </button>
            <div className="bg-red-700"></div>
          </div>
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
        {/* <div className="text-black font-bold text-xl flex items-center justify-center mb-4">
          Selected Value:{JSON.stringify(selectedValue || {}, null, 2)}
        </div> */}
        <div className="flex items-center justify-center">
          <div className="w-[500px]">
            <AsyncSelect
              cacheOptions
              defaultOptions
              value={selectedValue}
              getOptionLabel={(e) => e.MerchantName}
              getOptionValue={(e) => e.MerchantId}
              loadOptions={handleRequest}
              onInputChange={handleInputChange}
              onChange={handleChange}
              placeholder="Select Merchant"
            />
          </div>
          <div>
            <button
              onClick={saveMerchantDetails}
              type="submit"
              className="text-white bg-red-600 hover:bg-red-700 hover:font-bold font-medium text-sm p-2.5 text-center w-[100px]"
            >
              GO
            </button>
            <div className="bg-red-700"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
