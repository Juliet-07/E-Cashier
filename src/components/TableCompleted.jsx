import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  encryptPayload,
  decryptPayload,
} from "../shared/services/e-cashier-encryption.service";
import { hashedRequest } from "../shared/services/request-script";
import { BsDownload } from "react-icons/bs";

const Table = () => {
  // const { REACT_APP_ROOT_IP } = process.env();
  const [user, setUser] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [controlNo, setControlNo] = useState("");
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    try {
      const getData = async () => {
        const user = JSON.parse(localStorage.getItem("Username"));
        if (user !== null || user !== undefined) {
          setUser(user);
          console.log(user, "user");
          if (user.givenname) await getUserDetail(user.givenname);
        }
      };
      getData();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const getUserDetail = async (givenname) => {
    const url = `${process.env.REACT_APP_ROOT_IP}/GetUserDetail?UserID=${givenname}`;
    await axios.get(url).then(async (response) => {
      const data = response.data.result;
      console.log({ data });
      setUserDetails(data);
      console.log(userDetails, "user-details");
      const { branchCode } = data;
      if (branchCode) await fetchApprovedTransaction(branchCode);
    });
  };

  const fetchApprovedTransaction = async (branchCode) => {
    const url = `${process.env.REACT_APP_ROOT_IP}/GetApprovedTransaction?Auth_BRANCH_CODE=${branchCode}`;
    try {
      await axios.get(url).then((response) => {
        console.log(response.data.result, "Approved transaction");
        setTransactions(response.data.result);
      });
    } catch (error) {
      console.log(error);
    }
  };
  

  const getStatus = (status) => {
    let statusClass;
    switch (status) {
      case "approved":
        statusClass = "Failed";
        break;

      case "pending":
        statusClass = "Pending";
        break;

      default:
        statusClass = "Approved";
        break;
    }
    return statusClass;
  };

  // function for the entire api flow;{encryption, getData, decryption}
  // const handleMerchantRequest = async () => {
  //   let result;
  //   await encryptPayload({
  //     BranchCode: "001",
  //   }).then(async (response) => {
  //     result = await getAvailableMerchants(response.data);
  //     console.log({ result });
  //   });
  //   return result;
  // };

  // function to getData for available Merchants
  // const getAvailableMerchants = async (searchParams) => {
  //   const url = `https://test.xpresspayments.com:9015/api/ApiGateway/GetAvailableMerchants?request=${searchParams}`;
  //   let result;
  //   await axios
  //     .get(url)
  //     .then(async (response) => {
  //       result = await handleMerchantDecrypt(response.data.data);
  //     })
  //     .catch((error) => console.log(error));
  //   return result;
  // };

  // function to decrypt encrypted data
  // const handleMerchantDecrypt = async (encryptedData) => {
  //   let result;
  //   await decryptPayload(encryptedData).then((decryptResponse) => {
  //     decryptResponse.data = JSON.parse(decryptResponse.data);
  //     result = decryptResponse.data;
  //     console.log(result);
  //   });
  //   return result;
  // };

  // function to save merchant details
  // const saveMerchantDetails = () => {
  //   if (selectedValue !== null) {
  //     localStorage.setItem("Merchant", JSON.stringify(selectedValue));
  //     return navigate("/paywithid");
  //   }
  //   return alert("Please select Merchant");
  // };
  // function to use merchant details across application
  const getMerchantDetails = () => {
    return JSON.parse(localStorage.getItem("Merchant"));
  };

  // function to handle printing receipt
  const handleRequest = async (event, item) => {
    let result;
    await encryptPayload({
      MerchantId: 3,
      BranchCode: userDetails.branchCode,
      TransactionReference: item?.transactionReference,
      ControlNo: controlNo,
      PayerEmail: item?.payerEmail,
    }).then(async (response) => {
      result = await printReceipt(response.data);
      console.log(result);
      const url = window.URL.createObjectURL(new Blob([result]));
      console.log(url, "url");
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "transaction_receipt.pdf"); //or any other extension
      document.body.appendChild(link);
      link.click();
    });
    return result;
  };

  const printReceipt = async (searchParams) => {
    const url = `https://test.xpresspayments.com:9015/api/Receipt/PrintReceipt?request=${searchParams}`;
    let result;
    await axios({ url: url, method: "POST", responseType: "blob" })
      .then((response) => {
        console.log(response.data, "response from print receipt");
        result = response.data;
      })
      .catch((error) => console.log(error));
    return result;
  };

  const handlePaymentRequest = async (event, item, bankpaymentreference) => {
    let result;
    console.log("data From row", item);
    let paidItems = item.item;
    let PaymentItemsPaid = [];
    paidItems.forEach((element) => {
      PaymentItemsPaid.push({
        PaymentItemCode: element.paymentItemCode,
        Amount: parseInt(element.amount),
      });
      console.log(PaymentItemsPaid, "element");
    });
    const payload = {
      BankBranchCode: userDetails.branchCode,
      TransactionReference: item?.transactionReference,
      BankPaymentReference: item?.debiT_REF,
      TransactionStatusId: 2,
      PaymentMethodId: 1,
      PaymentChannelId: 1,
      IsChequeTransaction: false,
      IsThirdPartyCheque: false,
      ChequeIssuingBankCode: "",
      ChequeNo: "",
      ChequeDate: "",
      DebitAccName: "TellerTill or 11110111111",
      DebitAccNo: "11110111121",
      DepositorName: "Payer Name",
      DepositorSlipNo: item?.depositorSlipNo,
      PostedBy: user.name,
      TerminalId: "",
      TaxOfficeId: parseInt(item?.officeid),
      TotalAmountPaid: parseInt(item?.totalAmount),
      Narration: "Payment from PremiumTrust Bank",
      PaymentItemsPaid: PaymentItemsPaid,
    };
    console.log(payload, "payload for renotifying");
    await encryptPayload(payload).then(async (response) => {
      result = await paymentNotification(response.data);
      console.log({ result });
    });
    return result;
  };

  const paymentNotification = async (searchParams) => {
    const url = `https://test.xpresspayments.com:9015/api/ApiGateway/PaymentNotification?request=${searchParams}`;
    let result;
    await axios
      .post(url)
      .then(async (response) => {
        console.log(response.data, "response from payment request");
        result = await handleDecrypt(response.data.data);
        console.log("decrypted result", result);
      })
      .catch((erroror) => console.log(erroror));
    return result;
  };

  const handleDecrypt = async (encryptedData) => {
    let result;
    await decryptPayload(encryptedData).then((decryptResponse) => {
      decryptResponse.data = JSON.parse(decryptResponse.data);
      result = decryptResponse.data;
      window.alert(result.ResponseMessage);
      console.log(result);
    });
    return result;
  };
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 h-[60px]">
                <tr>
                  <th
                    scope="col"
                    className="text-sm font-semibold text-gray-500 uppercase text-left px-6"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-semibold text-gray-500 uppercase text-left px-6"
                  >
                    Reference No.
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-semibold text-gray-500 uppercase"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-semibold text-gray-500 uppercase"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-semibold text-gray-500 uppercase text-left px-6"
                  >
                    Initiated by
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-semibold text-gray-500 uppercase"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-semibold text-gray-500 uppercase"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.length > 0 &&
                  transactions.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td className="px-6 whitespace-nowrap">
                          {item?.payerName}
                          {item?.name}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          {item?.transactionReference}
                        </td>
                        <td className="p-4 whitespace-nowrap text-right">
                          {item?.totalAmount}
                        </td>
                        <td className="p-4 whitespace-nowrap text-center">
                          {item?.requestDate}
                        </td>
                        <td className="p-4 whitespace-nowrap text-left">
                          {item?.initialisedBy}
                        </td>
                        <td className="p-4 whitespace-nowrap text-center text-green-500">
                          {getStatus(item?.status)}
                        </td>
                        <td className="flex items-center justify-center">
                          <input
                            placeholder="Control No."
                            type="text"
                            className=" text-gray-700 border border-red-600 rounded py-3 px-4"
                            // name={index}
                            value={index.controlNo}
                            onChange={(e, index) =>
                              setControlNo(e.target.value, index)
                            }
                          />

                          <button
                            type="submit"
                            onClick={(e) => handleRequest(e, item)}
                            className="text-white bg-red-600 hover:bg-red-700 hover:font-bold font-semibold text-sm text-center w-10 p-2 rounded mx-3"
                          >
                            <BsDownload size={20} />
                          </button>
                        </td>
                        <td>
                          <button
                            type="submit"
                            onClick={(e) =>
                              handlePaymentRequest(
                                e,
                                item
                                // bankpaymentreference
                              )
                            }
                            className="w-full text-white bg-green-600 hover:bg-green-700 hover:font-bold font-semibold text-sm text-center p-2 rounded"
                          >
                            Renotify
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Table;
