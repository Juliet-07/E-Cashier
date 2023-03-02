import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  decryptPayload,
  encryptPayload,
} from "../shared/services/e-cashier-encryption.service";
import TaxOffice from "../components/TaxOffice";
import { hashedRequest } from "../shared/services/request-script";

const PayWithAssessment = () => {
  const navigate = useNavigate();
  const { handleSubmit } = useForm();
  const [assessment, setAssesment] = useState("");
  const initialValues = {
    PayerName: "",
    PayerEmail: "",
    PayerAddress: "",
    PayerPhone: "",
    TotalAmount: "",
    PaymentPeriod: "",
    Comment: "",
    TransactionReference: "",
    DepositorSlipNo: "",
    officeId: "",
    item: [],
  };
  const [payerDetails, setPayerDetails] = useState(initialValues);
  const {
    PayerName,
    PayerEmail,
    PayerAddress,
    PayerPhone,
    TotalAmount,
    PaymentPeriod,
    Comment,
    TransactionReference,
    DepositorSlipNo,
    officeId,
    item,
  } = payerDetails;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayerDetails({ ...payerDetails, [name]: value });
  };

  // function to use merchant details across application
  const getMerchantDetails = () => {
    return JSON.parse(localStorage.getItem("Merchant"));
  };

  // function to use tax-office details across application
  const getOfficeId = () => {
    return JSON.parse(localStorage.getItem("TaxOfficeInfo"));
  };

  // function to fetch initialiser details
  const [user, setUser] = useState("");
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("Username"));
    if (user !== null || user !== undefined) {
      setUser(user);
    }
    const url = `http://192.168.207.18:8091/GetUserDetail?UserID=${user.givenname}`;
    const getUserDetail = async () => {
      await hashedRequest({
        method: "GET",
        baseUrl: url,
      }).then((response) => {
        // console.log(response.data.result);
        const data = response.data.result;
        setUserDetails(data);
        console.log(userDetails, "user-details");
      });
    };
    getUserDetail();
  }, []);
  const [userDetails, setUserDetails] = useState({});

  // function for the entire api flow;{encryption, handlePostRequest & decryption}
  const handleRequest = async () => {
    let result;
    await encryptPayload({
      MerchantId: getMerchantDetails().MerchantId,
      BankBranchCode: userDetails.branchCode,
      PaymentOptionId: 302,
      CreatedBy: user.name,
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
    const url = `https://test.xpresspayments.com:9015/api/ApiGateway/PostTransaction?request=${searchParams}`;
    let result;
    await axios.post(url).then(async (response) => {
      console.log(response.data, "response from post request");
      window.alert(response.data.responseMessage);
      result = await handleDecrypt(response.data.data);
      console.log("decrypted result", result);
      const detail = result.payerDetails;
      const _items = [];
      result.paymentItemDetails.forEach((item) => {
        const _itemsObject = {
          PaymentItemName: item.PaymentItemName,
          Amount: String(item.Amount),
          PaymentItemCode: item.PaymentItemCode,
        };
        _items.push(_itemsObject);
      });
      setPayerDetails({
        PayerName: detail.PayerName,
        PayerEmail: detail.PayerEmail,
        PayerPhone: detail.PayerPhone,
        PayerAddress: detail.PayerAddress,
        TotalAmount: String(result.TotalAmount),
        TransactionReference: result.TransactionReference,
        item: [...[], ..._items],
      });
    });
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
  // sending received data to premium database.
  const url = "http://192.168.207.18:8091/CreateECashData";
  const createData = async () => {
    payerDetails.branchcode = userDetails.branchCode;
    payerDetails.initialisedBy = userDetails.userName;
    payerDetails.officeId = String(getOfficeId().OfficeId);
    console.log(payerDetails);
    await hashedRequest({
      method: "POST",
      body: payerDetails,
      baseUrl: url,
    }).then((response) => {
      console.log(response.data, "response here for creating data");
      alert("Transaction Completed");
      navigate("/transactionSuccessful");
    });
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
          onSubmit={handleSubmit(handleRequest)}
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
      <div className="h-full shadow-xl mx-20 mb-10 border rounded border-red-600 text-red-600 font-medium text-sm p-4">
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
            <table className="w-full border border-red-600">
              <thead className="bg-gray-50 h-[60px]">
                <tr>
                  <th className="text-sm font-semibold text-black">
                    Payment Items
                  </th>
                  <th className="text-sm font-semibold text-black">
                    Payment Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payerDetails.item.length > 0 &&
                  payerDetails.item.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td className="p-4 whitespace-nowrap text-left text-black">
                          {item?.PaymentItemName}
                        </td>
                        <td>
                          <input
                            className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                            type="text"
                            name={index}
                            value={item?.Amount}
                            onChange={(e) => {
                              item.Amount = e.target.value;
                              setPayerDetails({ ...payerDetails });
                              const total = payerDetails.item
                                .map((x) => parseInt(x.Amount))
                                .reduce((a, b) => a + b, 0);
                              payerDetails.TotalAmount = `${total}`;
                              setPayerDetails({ ...payerDetails });
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block tracking-wide text-black text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Total Amount
              </label>
              <input
                className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                id="amount"
                type="text"
                name="TotalAmount"
                value={TotalAmount}
                onChange={handleChange}
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
                placeholder="Jan - Dec 2000"
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
                Depositor Slip Number
              </label>
              <input
                className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                id="fee"
                type="text"
                required
                name="DepositorSlipNo"
                value={DepositorSlipNo}
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
            <div>
              <label
                htmlFor="countries"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
              >
                Select TaxOffice
              </label>
              <TaxOffice />
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
