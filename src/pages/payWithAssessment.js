import React, { useState } from "react";
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
  };
  const [payerDetails, setPayerDetails] = useState(initialValues);
  const { PayerName, PayerEmail, PayerAddress, PayerPhone, Amount } =
    payerDetails;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayerDetails({ ...payerDetails, [name]: value });
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
          Amount: figure[0].Amount,
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
      <div className="h-[700px] shadow-xl mx-20 mb-10 border rounded border-red-600 text-red-600 font-medium text-sm p-4">
        <form className="m-4">
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
                // placeholder="Jane"
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                for="countries"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Tax Office
              </label>
              <select
                id="countries"
                className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
              >
                <option>United States</option>
                <option>Canada</option>
                <option>France</option>
                <option>Germany</option>
              </select>
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
                name="Amount"
                value={Amount}
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
                // placeholder="Doe"
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
                // placeholder="Jane"
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
                // placeholder="Doe"
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
