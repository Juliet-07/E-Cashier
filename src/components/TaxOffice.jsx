import React, { useState } from "react";
import axios from "axios";
import {
  encryptPayload,
  decryptPayload,
} from "../shared/services/e-cashier-encryption.service";
import AsyncSelect from "react-select/async";

const TaxOffice = () => {
  const [inputValue, setValue] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);

  const handleInputChange = (value) => {
    setValue(value);
  };

  const handleChange = (value) => {
    console.log(value);
    setSelectedValue(value);
    localStorage.setItem("TaxOfficeInfo", JSON.stringify(value));
  };
  // function to use merchant details across application
  const getMerchantDetails = () => {
    return JSON.parse(localStorage.getItem("Merchant"));
  };

  // function for the entire api flow;{encryption, getData, decryption}
  const handleRequest = async () => {
    let result;
    await encryptPayload({
      BranchCode: "001",
      MerchantId: getMerchantDetails().MerchantId,
    }).then(async (response) => {
      result = await getTaxOffices(response.data);
      console.log({ result });
    });
    return result;
  };

  // function to getData for available Merchants
  const getTaxOffices = async (searchParams) => {
    const url = `https://test.xpresspayments.com:9015/api/ApiGateway/GetTaxOffices?request=${searchParams}`;
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
  return (
    <div className="flex items-center justify-center">
      <div className="w-[500px]">
        <AsyncSelect
          cacheOptions
          defaultOptions
          value={selectedValue}
          getOptionLabel={(e) => e.OfficeName}
          getOptionValue={(e) => e.OfficeId}
          loadOptions={handleRequest}
          onInputChange={handleInputChange}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default TaxOffice;
