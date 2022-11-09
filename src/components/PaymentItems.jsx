import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  encryptPayload,
  decryptPayload,
} from "../shared/services/e-cashier-encryption.service";
import Multiselect from "multiselect-react-dropdown";

const PaymentItems = () => {
  const [data, setData] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);

  const handleChange = (value) => {
    console.log(value);
    setSelectedValue(value);
    localStorage.setItem("PaymentItemId", JSON.stringify(value));
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
      result = await getMerchantPaymentItems(response.data);
      console.log({ result });
    });
    return result;
  };

  // function to getData for Merchants Payment Items
  const getMerchantPaymentItems = async (searchParams) => {
    const url = `http://80.88.8.239:9011/api/ApiGateway/GetMerchantPaymentItems?request=${searchParams}`;
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
      decryptResponse.data = JSON.parse(decryptResponse.data);
      result = decryptResponse.data.map((item) => {
        return { id: item.PaymentItemID, name: item.PaymentRevenueItemName };
      });
      setData(result);
      console.log(result, "show me");
    });
    return result;
  };
  useEffect(() => {
    handleRequest();
  }, []);
  return (
    <div className="flex items-center justify-center">
      <div className="w-[500px] border rounded border-red-600">
        <Multiselect
          options={data}
          selectedValues={selectedValue}
          onSelect={handleChange}
          displayValue="name"
        />
      </div>
    </div>
  );
};

export default PaymentItems;
