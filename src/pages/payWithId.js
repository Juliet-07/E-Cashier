import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Navbar from "../components/Navbar";
import axios from "axios";
import {
  decryptPayload,
  encryptPayload,
} from "../shared/services/e-cashier-encryption.service";
import PaymentItems from "../components/PaymentItems";
import Modal from "../components/confirmModal";

const PayWithId = () => {
  const { handleSubmit } = useForm();
  const [CustomerReference, setCustomerReference] = useState("");
  const initialValues = {
    PayerName: "",
    PayerEmail: "",
    PayerAddress: "",
    PayerPhone: "",
    TotalAmount: "",
    branchcode: "",
    PaymentPeriod: "",
    Comment: "",
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
    TotalAmount,
    branchcode,
    PaymentPeriod,
    Comment,
    TransactionReference,
    DepositorSlipNo,
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

  // function to fetch initialiser details
  const [user, setUser] = useState("");
  // const [_branchCode, setBranchCode] = useState("");
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("Username"));
    if (user !== null || user !== undefined) {
      setUser(user);
    }
    const getUserDetail = async () => {
      await axios
        .get(
          `http://192.168.207.18:8091/GetUserDetail?UserID=${user.givenname}`
        )
        .then((response) => {
          console.log(response.data.result);
          const data = response.data.result;
          // console.log(data.branchCode, "checking what is here");
          payerDetails.branchcode = data.branchCode;
          console.log(payerDetails.branchcode, "here");
          // setPayerDetails({
          //   branchCode: data.branchCode,
          // });
          // setBranchCode(response.data.result.branchCode);
        });
    };
    getUserDetail();
  }, []);

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
      BankBranchCode: branchcode,
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
  const createData = () => {
    console.log(payerDetails);
    axios.post(url, payerDetails).then((response) => {
      console.log(response.data, "response here for creating data");
      alert("Transaction Completed");
    });
  };

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
                {payerDetails.item.length > 0 &&
                  payerDetails.item.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td className="p-4 whitespace-nowrap text-left text-black">
                          {data.PaymentItemName}
                        </td>
                        <td>
                          <input
                            className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                            type="text"
                            name={index}
                            value={data.Amount}
                            onChange={(e) => {
                              data.Amount = e.target.value;
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
                htmlFor="total"
              >
                Total Amount
              </label>
              <input
                className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                id="total"
                type="text"
                name="TotalAmount"
                value={TotalAmount}
                onChange={handleChange}
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
                htmlFor="branchcode"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Branch Code
              </label>
              <input
                className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                id="branchcode"
                type="text"
                name="branchcode"
                required
                value={branchcode}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex items-end justify-between m-4">
            <Modal />
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
