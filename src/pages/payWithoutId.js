import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Navbar from "../components/Navbar";
import axios from "axios";
import {
  decryptPayload,
  encryptPayload,
} from "../shared/services/e-cashier-encryption.service";
import PaymentItems from "../components/PaymentItems";

const PayWithoutId = () => {
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
    paymentAmount: "",
    paymentPeriod: "",
    comment: "",
    conveniencyFee: "",
    TransactionReference: "",
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
    TransactionReference,
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
          TransactionReference: details.TransactionReference,
        }),
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((json) => console.log(json));
      alert("SENT");
    } catch (error) {
      console.log(error.message);
    }
  };

  // function to use merchant details across application
  const getMerchantDetails = () => {
    return JSON.parse(localStorage.getItem("Merchant"));
  };

  // function for the entire api flow;{encryption, handlePostRequest & decryption}
  const handleRequest = async () => {
    let result;
    await encryptPayload({
      MerchantId: getMerchantDetails().MerchantId,
      // MerchantId: 1,
      BankBranchCode: "XPS",
      PaymentOptionId: 301,
      CreatedBy: "Test",
      PaymentItems: [{ PaymentItemId: 1 }, { PaymentItemId: 2 }],
      // PaymentItems: [{ PaymentItemId: 1732 }, { PaymentItemId: 1745 }],
      PayerDetails: postDetails,
      PaymentOptionItems: {
        AssessmentReference: "",
        CustomerReference: "",
        BillReference: "",
      },
    }).then(async (response) => {
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
          paymentAmount: figure[0].Amount,
          TransactionReference: result.TransactionReference,
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

  // getting initialiser
  const [user, setUser] = useState("");
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("Username"));
    if (user !== null || user !== undefined) {
      setUser(user);
    }
  }, []);
  return (
    <>
      <Navbar />
      <div className="mx-20 my-4 p-2 w-[1000px] h-10 font-semibold">
        {getMerchantDetails().MerchantName}
      </div>
      <div className="h-[500px] shadow-xl mx-20 border rounded border-red-600 text-red-600 font-medium text-sm p-4">
        <form className="m-4" onSubmit={handleSubmit(handleRequest)}>
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
              <PaymentItems />
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
      <div className="h-[750px] shadow-xl mx-20 mb-10 border rounded border-red-600 text-red-600 font-medium text-sm p-4">
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
                readOnly
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
                readOnly
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
                readOnly
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
                readOnly
              />
            </div>
          </div>
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
                readOnly
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
                required
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
                required
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
                required
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block tracking-wide text-black text-xs font-bold mb-2"
                htmlFor="initializer"
              >
                Initialised By
              </label>
              <input
                className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                id="initializer"
                type="text"
                value={user.name}
                readOnly
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                htmlFor="branchcode"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Branch Code
              </label>
              <input
                className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                id="branchcode"
                type="text"
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block tracking-wide text-black text-xs font-bold mb-2"
                htmlFor="transactionReference"
              >
                Transaction Reference
              </label>
              <input
                className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                id="email"
                type="text"
                value={TransactionReference}
                readOnly
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                htmlFor="date"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Date
              </label>
              <input
                className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                id="date"
                type="text"
                required
                value={Date}
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
