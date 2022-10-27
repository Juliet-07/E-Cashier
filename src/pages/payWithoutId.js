import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Navbar from "../components/Navbar";
import axios from "axios";
import AsyncSelect from "react-select/async";
import {
  decryptPayload,
  encryptPayload,
} from "../shared/services/e-cashier-encryption.service";
import TaxOffice from "../components/TaxOffice";

const PayWithoutId = () => {
  const [inputValue, setValue] = useState("");
  const { handleSubmit } = useForm();
  const preFormValues = {
    PayerName: "",
    PayerEmail: "",
    PayerPhone: "",
    PayerAddress: "",
  };
  const [postDetails, setPostDetails] = useState(preFormValues);
  const { PayerName, PayerEmail, PayerAddress, PayerPhone } = postDetails;
  const handlePreFormValueChange = (e) => {
    const { name, value } = e.target;
    setPostDetails({ ...postDetails, [name]: value });
  };
  const initialValues = {
    name: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    paymentAmount: 0,
    paymentPeriod: "",
    comment: "",
    conveniencyFee: "",
    taxOffice: "",
  };
  const [details, setDetails] = useState(initialValues);
  const {
    name,
    email,
    phone,
    address,
    paymentAmount,
    paymentPeriod,
    comment,
    conveniencyFee,
    taxOffice,
  } = details;
  const changePaymentDetails = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };
  // sending received data to premium database.
  const url = "http://192.168.207.18:8091/CreateECashData";
  const createData = () => {
    try {
      fetch(url, {
        method: "POST",
        // body: details,
        body: JSON.stringify({
          name: details.name,
          email: details.email,
          phone: details.phone,
          address: details.address,
          paymentAmount: details.paymentAmount,
          paymentPeriod: details.paymentPeriod,
          comment: details.comment,
          conveniencyFee: details.conveniencyFee,
          taxOffice: details.taxOffice,
        }),
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((json) => console.log(json));
        alert("SENT")
    } catch (error) {
      console.log(error.message);
    }
  };
  const [selectedValue, setSelectedValue] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (value) => {
    setValue(value);
  };

  const handleChange = (value) => {
    setSelectedValue(value);
  };

  // function to use merchant details across application
  const getMerchantDetails = () => {
    return JSON.parse(localStorage.getItem("Merchant"));
  };

  // function for the entire api flow;{encryption, getData, handlePostRequest & decryption}
  const handleRequest = async () => {
    let result;
    await encryptPayload({
      BranchCode: "XPS",
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
  const savePaymentDetails = () => {
    if (selectedValue !== null) {
      localStorage.setItem("PaymentDetails", JSON.stringify(selectedValue));
      // return redirectToPaymentOptions();
    }
    return savePaymentDetails();
  };
  const getPaymentDetails = () => {
    return JSON.parse(localStorage.getItem("PaymentDetails"));
  };
  // function to post transaction
  const handlePostRequest = async () => {
    let result;
    await encryptPayload({
      // MerchantId: getMerchantDetails().MerchantId,
      MerchantId: 1,
      BankBranchCode: "XPS",
      PaymentOptionId: 301,
      CreatedBy: "Test",
      PaymentItems: [{ PaymentItemId: 1 }, { PaymentItemId: 2 }],
      PayerDetails: postDetails,
      PaymentOptionItems: {
        AssessmentReference: "",
        CustomerReference: "",
        BillReference: "",
      },
    }).then(async (response) => {
      console.log(response.data);
      result = await postRequest(response.data);
      console.log({ result });
    });
    return result;
  };

  const postRequest = async (searchParams) => {
    const url = `http://80.88.8.239:9011/api/ApiGateway/PostTransaction?request=${searchParams}`;
    let result;
    await axios
      .post(url)
      .then(async (response) => {
        console.log(response.data, "response from post request");
        result = await handleDecrypt(response.data.data);
        console.log("decrypted result", result);
        console.log("checking details", result.payerDetails.PayerName);
        const detail = result.payerDetails;
        const figure = result.paymentItemDetails;
        console.log(detail, "confirm here");
        setDetails({
          name: detail.PayerName,
          email: detail.PayerEmail,
          phone: detail.PayerPhone,
          address: detail.PayerAddress,
          paymentAmount: figure[0].amount,
        });
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
  return (
    <>
      <Navbar />
      <div className="mx-20 my-4 p-2 w-[1000px] h-10 font-semibold">
        {getMerchantDetails().MerchantName}
      </div>
      <div className="h-[500px] shadow-xl mx-20 border rounded border-red-600 text-red-600 font-medium text-sm p-4">
        <form className="m-4" onSubmit={handleSubmit(handlePostRequest)}>
          <div className="flex">
            <div className="mr-20">
              <label
                htmlFor="ref"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Payer Name
              </label>
              <input
                type="text"
                id="ref"
                className="shadow-sm bg-gray-50 border border-red-600 text-gray-900 text-sm block p-2.5 w-[500px]"
                required
                name="PayerName"
                value={PayerName}
                onChange={handlePreFormValueChange}
              />
            </div>
            <div>
              <label
                htmlFor="countries"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
              >
                Select Payment Items
              </label>
              <div className="w-[500px] border rounded border-red-600">
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  value={selectedValue}
                  getOptionLabel={(e) => e.PaymentRevenueItemName}
                  getOptionValue={(e) => e.PaymentRevenueItemNameId}
                  loadOptions={handleRequest}
                  onInputChange={handleInputChange}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="ref"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Payer Phone
            </label>
            <input
              type="text"
              id="ref"
              className="shadow-sm bg-gray-50 border border-red-600 text-gray-900 text-sm block p-2.5 w-[500px]"
              required
              name="PayerPhone"
              value={PayerPhone}
              onChange={handlePreFormValueChange}
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="ref"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Payer Email
            </label>
            <input
              type="email"
              id="ref"
              className="shadow-sm bg-gray-50 border border-red-600 text-gray-900 text-sm block p-2.5 w-[500px]"
              required
              name="PayerEmail"
              value={PayerEmail}
              onChange={handlePreFormValueChange}
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="ref"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Payer Address
            </label>
            <input
              type="text"
              id="ref"
              className="shadow-sm bg-gray-50 border border-red-600 text-gray-900 text-sm block p-2.5 w-[500px]"
              required
              name="PayerAddress"
              value={PayerAddress}
              onChange={handlePreFormValueChange}
            />
          </div>
          <div className="flex items-end justify-end m-4">
            <button
              type="submit"
              className="text-white bg-red-600 hover:bg-red-700 hover:font-bold font-medium text-sm p-2.5 text-center w-[200px]"
            >
              Search
            </button>
          </div>
        </form>
      </div>
      <div className="mt-20 mb-2 font-bold text-xl flex items-center justify-center">
        Payment Details
      </div>
      <div className="h-[700px] shadow-xl mx-20 mb-10 border rounded border-red-600 text-red-600 font-medium text-sm p-4">
        <form className="m-4" onSubmit={handleSubmit(createData)}>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block tracking-wide text-black text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Name
              </label>
              <input
                className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                id="grid-first-name"
                type="text"
                name="name"
                value={name}
                defaultValue
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block tracking-wide text-black text-xs font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                id="email"
                type="text"
                name="email"
                value={email}
                defaultValue
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block tracking-wide text-black text-xs font-bold mb-2"
                htmlFor="number"
              >
                Phone Number
              </label>
              <input
                className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                id="number"
                type="text"
                name="phone"
                value={phone}
                defaultValue
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="address"
              >
                Address
              </label>
              <input
                className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                id="grid-last-name"
                type="text"
                name="address"
                value={address}
                defaultValue
              />
            </div>
          </div>
          {/* <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block tracking-wide text-black text-xs font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                id="email"
                type="text"
                name="email"
                value={email}
                onChange={(e) => changePaymentDetails(e, 'name')}
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                htmlFor="countries"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Tax Office
              </label>
              <TaxOffice />
            </div>
          </div> */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block tracking-wide text-black text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Payment Amount
              </label>
              <input
                className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                id="amount"
                type="text"
                name="paymentAmount"
                value={paymentAmount}
                onChange={(e) => changePaymentDetails(e, "paymentAmount")}
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="period"
              >
                Payment Period
              </label>
              <input
                className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                id="period"
                type="text"
                name="paymentPeriod"
                value={paymentPeriod}
                onChange={(e) => changePaymentDetails(e, "paymentPeriod")}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block tracking-wide text-black text-xs font-bold mb-2"
                htmlFor="fee"
              >
                Conveniency Fee
              </label>
              <input
                className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                id="fee"
                type="text"
                name="conveniencyFee"
                value={conveniencyFee}
                onChange={(e) => changePaymentDetails(e, "conveniencyFee")}
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="comment"
              >
                Payment reason/comment
              </label>
              <input
                className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                id="comment"
                type="text"
                name="comment"
                value={comment}
                onChange={(e) => changePaymentDetails(e, "comment")}
              />
            </div>
          </div>
          <div className="flex items-end justify-end m-4">
            <button className="text-white bg-red-600 hover:bg-red-700 hover:font-bold font-medium text-sm p-2.5 text-center w-[200px]">
              Complete Transaction
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PayWithoutId;
