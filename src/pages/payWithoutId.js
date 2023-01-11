import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import {
  decryptPayload,
  encryptPayload,
} from "../shared/services/e-cashier-encryption.service";
import PaymentItems from "../components/PaymentItems";

const PayWithoutId = () => {
  const navigate = useNavigate();
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
    email: "",
    phone: "",
    address: "",
    TotalAmount: "",
    PaymentPeriod: "",
    Comment: "",
    TransactionReference: "",
    DepositorSlipNo: "",
    item: [],
  };
  const [details, setDetails] = useState(initialValues);
  const {
    name,
    email,
    address,
    phone,
    TotalAmount,
    PaymentPeriod,
    Comment,
    TransactionReference,
    DepositorSlipNo,
    item,
  } = details;
  const changePaymentDetails = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  // function to use merchant details across application
  const getMerchantDetails = () => {
    return JSON.parse(localStorage.getItem("Merchant"));
  };

  // getting initialiser details
  const [user, setUser] = useState("");
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
    const id = JSON.parse(localStorage.getItem("PaymentItemId"));
    let PaymentItemIds = [];
    id.forEach((element) => {
      PaymentItemIds.push({ PaymentItemId: element.id });
      console.log(PaymentItemIds, "element");
    });
    let result;
    await encryptPayload({
      MerchantId: getMerchantDetails().MerchantId,
      BankBranchCode: userDetails.branchCode,
      PaymentOptionId: 301,
      CreatedBy: user.name,
      PaymentItems: PaymentItemIds,
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
    const url = `https://test.xpresspayments.com:9015/api/ApiGateway/PostTransaction?request=${searchParams}`;
    let result;
    await axios.post(url).then(async (response) => {
      console.log(response.data, "response from post request");
      window.alert(response.data.responseMessage);
      result = await handleDecrypt(response.data.data);
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
      setDetails({
        name: detail.PayerName,
        email: detail.PayerEmail,
        phone: detail.PayerPhone,
        address: detail.PayerAddress,
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
    details.branchcode = userDetails.branchCode;
    details.initialisedBy = userDetails.userName;
    console.log(details);
    axios.post(url, details).then((response) => {
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
              Fetch
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
                {details.item.length > 0 &&
                  details.item.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td className="p-4 whitespace-nowrap text-left text-black">
                          {data?.PaymentItemName}
                        </td>
                        <td>
                          <input
                            className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                            type="text"
                            name={index}
                            value={data?.Amount}
                            // disabled={item.PartPaymentAllowed === false}
                            onChange={(e) => {
                              data.Amount = e.target.value;
                              setDetails({ ...details });
                              const total = details.item
                                .map((x) => parseInt(x.Amount))
                                .reduce((a, b) => a + b, 0);
                              details.TotalAmount = `${total}`;
                              setDetails({ ...details });
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
                onChange={changePaymentDetails}
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
                value={PaymentPeriod}
                onChange={(e) => changePaymentDetails(e, "PaymentPeriod")}
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
                Depositor SLip Number
              </label>
              <input
                className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                id="fee"
                type="text"
                name="DepositorSlipNo"
                value={DepositorSlipNo}
                onChange={(e) => changePaymentDetails(e, "DepositorSlipNo")}
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
                name="Comment"
                value={Comment}
                onChange={(e) => changePaymentDetails(e, "Comment")}
                required
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
                required
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
