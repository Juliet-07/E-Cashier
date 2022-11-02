import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Navbar from "../components/Navbar";
import {
  decryptPayload,
  encryptPayload,
} from "../shared/services/e-cashier-encryption.service";
import axios from "axios";

const PayWithAssessment = () => {
  const { handleSubmit } = useForm();
  const [assessment, setAssesment] = useState("");
  const initialValues = {
    PayerName: "",
    PayerEmail: "",
    PayerPhone: "",
    PayerAddress: "",
    Amount: "",
    TransactionReference: "",
    Date: "",
    PaymentPeriod: "",
    ConveniencyFee: "",
    Comment: "",
    Branch_Code: "",
    InitialisedBy: "",
  };
  const [payerDetails, setPayerDetails] = useState(initialValues);
  const {
    PayerName,
    PayerEmail,
    PayerAddress,
    PayerPhone,
    Amount,
    TransactionReference,
    Date,
    PaymentPeriod,
    ConveniencyFee,
    Comment,
    Branch_Code,
    InitialisedBy,
  } = payerDetails;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayerDetails({ ...payerDetails, [name]: value });
  };

  // sending received data to premium database.
  const url = "http://192.168.207.18:8091/CreateECashData";
  const createData = () => {
    axios
      .post(url, payerDetails)
      .then((response) => console.log(response.data, "response here o "));
    alert("SENT")
      // if (response.data === true) {
      //   alert("SENT");
      // }
      .catch((err) => console.log(err));
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
      BankBranchCode: "XPS",
      PaymentOptionId: 302,
      CreatedBy: "Test",
      PaymentItems: [],
      PayerDetails: payerDetails,
      PaymentOptionItems: {
        AssessmentReference: assessment,
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
        const detail = result.payerDetails;
        const figure = result.paymentItemDetails;
        console.log(figure[0].Amount, "confirm here");
        setPayerDetails({
          PayerName: detail.PayerName,
          PayerEmail: detail.PayerEmail,
          PayerPhone: detail.PayerPhone,
          PayerAddress: detail.PayerAddress,
          Amount: String(figure[0].Amount),
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
      <div className="h-[170px] shadow-xl mx-20 border rounded border-red-600 text-red-600 font-medium text-sm p-4">
        <form
          className="flex items-center m-4 p-4"
          onClick={handleSubmit(handleRequest)}
        >
          <div>
            <label
              htmlFor="ref"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Assesment Reference
            </label>
            <input
              type="text"
              id="ref"
              className="shadow-sm bg-gray-50 border border-red-600 text-gray-900 text-sm block p-2.5 w-[500px]"
              required
              name="assessment"
              value={assessment}
              onChange={(e) => setAssesment(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="text-white bg-red-600 hover:bg-red-700 hover:font-bold font-medium text-sm p-2.5 text-center w-[130px] h-[40px] mt-8"
          >
            Search
          </button>
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
                Payer Name
              </label>
              <input
                className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                id="grid-first-name"
                type="text"
                name="PayerName"
                value={PayerName}
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
                name="PayerEmail"
                required
                value={PayerEmail}
                onChange={handleChange}
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
                name="PayerPhone"
                required
                value={PayerPhone}
                onChange={handleChange}
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
                name="PayerAddress"
                value={PayerAddress}
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
                name="Amount"
                value={Amount}
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
                required
                name="PaymentPeriod"
                value={PaymentPeriod}
                onChange={handleChange}
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
                required
                name="ConveniencyFee"
                value={ConveniencyFee}
                onChange={handleChange}
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
                required
                name="Comment"
                value={Comment}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3">
              <label
                htmlFor="initializer"
                className="block mb-2 text-sm font-medium text-gray-900"
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
                name="Branch_Code"
                value={Branch_Code}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3">
              <label
                htmlFor="transactionReference"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Transaction Reference
              </label>
              <input
                className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                id="transactionReference"
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
                onChange={handleChange}
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

export default PayWithAssessment;
