import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Navbar from "../components/Navbar";
import axios from "axios";
import {
  decryptPayload,
  encryptPayload,
} from "../shared/services/e-cashier-encryption.service";
import PaymentItems from "../components/PaymentItems";

const PayWithId = () => {
  const { handleSubmit } = useForm();
  const [CustomerReference, setCustomerReference] = useState("");
  const [paymentItemDetails, setPaymentItemDetails] = useState([]);
  const initialValues = {
    PayerName: "",
    PayerEmail: "",
    PayerAddress: "",
    PayerPhone: "",
    Amount: "",
    ConveniencyFee: "",
    PaymentPeriod: "",
    Comment: "",
    InitialisedBy: "",
    Branch_Code: "",
    Date: "",
    TransactionReference: "",
    DepositorSlipNo: "",
    item: [],
  };
  const [payerDetails, setPayerDetails] = useState(initialValues);
  const {
    PayerName,
    PayerEmail,
    PayerAddress,
    PayerPhone,
    Amount,
    ConveniencyFee,
    PaymentPeriod,
    Comment,
    InitialisedBy,
    Branch_Code,
    Date,
    TransactionReference,
    DepositorSlipNo,
    item,
  } = payerDetails;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayerDetails({ ...payerDetails, [name]: value });
  };

  // sending received data to premium database.
  const url = "http://192.168.207.18:8091/CreateECashData";
  const createData = () => {
    const _items = [];
    paymentItemDetails.forEach((item) => {
      const _itemsObject = {
        PaymentItemName: item.PaymentItemName,
        Amount: String(item.Amount),
        PaymentItemCode: item.PaymentItemCode,
      };
      _items.push(_itemsObject);
    });
    setPayerDetails({ ...payerDetails, item: _items });
    console.log(payerDetails, "engine oka");
    axios.post(url, payerDetails).then((response) => {
      console.log(response.data, "response here for creating data");
      alert("Transaction Completed");
    });
  };
  // function to use merchant details across application
  const getMerchantDetails = () => {
    return JSON.parse(localStorage.getItem("Merchant"));
  };

  // function for the entire api flow;{encryption, postTransaction & decryption}
  const handleRequest = async () => {
    const id = JSON.parse(localStorage.getItem("PaymentItemId"));
    let PaymentItemIds = [];
    id.forEach((element) => {
      PaymentItemIds.push({ PaymentItemId: element.id });
      console.log(PaymentItemIds, "element");
    });
    let result;
    await encryptPayload({
      MerchantId: getMerchantDetails().MerchantId,
      BankBranchCode: "001",
      PaymentOptionId: 300,
      CreatedBy: user.name,
      PaymentItems: PaymentItemIds,
      PayerDetails: payerDetails,
      PaymentOptionItems: {
        AssessmentReference: "",
        CustomerReference: CustomerReference,
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
    await axios.post(url).then(async (response) => {
      console.log(response.data, "response from post request");
      window.alert(response.data.responseMessage);
      result = await handleDecrypt(response.data.data);
      console.log("decrypted result", result);
      const detail = result.payerDetails;
      setPayerDetails({
        PayerName: detail.PayerName,
        PayerEmail: detail.PayerEmail,
        PayerPhone: detail.PayerPhone,
        PayerAddress: detail.PayerAddress,
        Amount: String(result.TotalAmount),
        TransactionReference: result.TransactionReference,
      });
    });
    setPaymentItemDetails(result.paymentItemDetails);
    // console
    //   .log(paymentItemDetails, "julie")
    // .catch((error) => console.log(error));
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
      <div className="h-[200px] shadow-xl mx-20 border rounded border-red-600 text-red-600 font-medium text-sm p-4">
        <form onSubmit={handleSubmit(handleRequest)}>
          <div className="flex items-center justify-around m-4">
            <div>
              <label
                htmlFor="ref"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Customer Reference
              </label>
              <input
                type="text"
                id="ref"
                className="shadow-sm bg-gray-50 border border-red-600 text-gray-900 text-sm block p-2.5 w-[500px]"
                required
                value={CustomerReference}
                onChange={(e) => setCustomerReference(e.target.value)}
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
          <div className="flex items-end justify-end m-2">
            <button
              type="submit"
              className="text-white bg-red-600 hover:bg-red-700 hover:font-bold font-medium text-sm p-2.5 text-center w-[150px]"
            >
              Search
            </button>
          </div>
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
                {paymentItemDetails.length > 0 &&
                  paymentItemDetails.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td className="p-4 whitespace-nowrap text-left text-black">
                          {item.PaymentItemName}
                        </td>
                        <td>
                          <input
                            className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                            type="text"
                            name="Amount"
                            value={item.Amount}
                            disabled={item.PartPaymentAllowed === false}
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
                htmlFor="total"
              >
                Total Amount
              </label>
              <input
                className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                id="total"
                type="text"
                name="Amount"
                value={Amount}
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
                Depositor Slip Number
              </label>
              <input
                className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                id="fee"
                type="text"
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
                name="InitialisedBy"
                value={InitialisedBy}
                onChange={handleChange}
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
                name="Date"
                placeholder="dd-mm-yy"
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

export default PayWithId;
