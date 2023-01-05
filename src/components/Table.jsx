import React, { useState, useEffect } from "react";
import axios from "axios";
import { TiTick } from "react-icons/ti";
import { RiDeleteBack2Fill } from "react-icons/ri";
import {
  decryptPayload,
  encryptPayload,
} from "../shared/services/e-cashier-encryption.service";

const Table = () => {
  const current = new Date();
  const date = `${current.getDate()}/${
    current.getMonth() + 1
  }/${current.getFullYear()}`;
  const [user, setUser] = useState("");
  const [transactions, setTransactions] = useState([]);
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
    await axios
      .get(`http://192.168.207.18:8091/GetUserDetail?UserID=${givenname}`)
      .then(async (response) => {
        const data = response.data.result;
        console.log({ data });
        setUserDetails(data);
        console.log(userDetails, "user-details");
        const { branchCode } = data;
        if (branchCode) await fetchPendingTransaction(branchCode);
      });
  };

  const fetchPendingTransaction = async (branchCode) => {
    try {
      await axios
        .get(
          `http://192.168.207.18:8091/GetPendingTransaction?Auth_BRANCH_CODE=${branchCode}`
        )
        .then((response) => {
          console.log(response.data.result, "pending transaction");
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
        statusClass = "Success";
        break;

      case "declined":
        statusClass = "Failed";
        break;

      default:
        statusClass = "Pending";
        break;
    }
    return statusClass;
  };

  const handleAction = async (event, item) => {
    await handleAuthorize(event, item);
    await handleDebit(event, item);
  };

  // function for payment authorization
  const handleAuthorize = async (event, item) => {
    console.log(item, "iminkwa");
    const url = `http://192.168.207.18:8091/AuthorisedCashData?AuthorizedBy=${
      user.name
    }&DateAuthorized=${date}&TransactionReference=${
      item?.transactionReference
    }&_STATUS=${1}`;
    await axios
      .post(url)
      .then((response) => console.log(response, "response from authorizer"));
  };

  // function for debit call
  function randomString(length, chars) {
    var result = "";
    for (var i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
  const handleDebit = async (event, item) => {
    const url = "http://192.168.207.18:8085/api/Account/PostTransaction";
    let externalReference = randomString(
      16,
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    );
    try {
      const payload = {
        amount: parseInt(item?.totalAmount),
        sourceAccount: userDetails.sourceAccount,
        destinationAccount: userDetails.destinationAccount,
        applyFee: false,
        narration: "Deployed test",
        fees: [
          {
            account: userDetails.sourceAccount,
            amount: 0,
            narration: "Deployed Trans",
            trnCode: "122",
          },
          {
            account: userDetails.sourceAccount,
            amount: 0,
            narration: "Test Trans",
            trnCode: "122",
          },
        ],
        externalReference: externalReference,
        trnCode: "122",
      };
      await axios.post(url, payload).then(async (response) => {
        console.log(response, "response from debit api");
        window.alert(response.data.respMsg);
        // setBankPaymentReference(response.data.data.referenceNo);
        // console.log("reference ndi bank", BankPaymentReference);
        handleRequest(event, item, response.data.data.referenceNo);
        saveReference(event, item, response.data.data.referenceNo);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // function to send notification to XpressPay {entire flow of encryption, call api and decryption}
  const handleRequest = async (event, item, bankpaymentreference) => {
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
    await encryptPayload({
      BankBranchCode: userDetails.branchCode,
      TransactionReference: item?.transactionReference,
      BankPaymentReference: bankpaymentreference,
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
      TaxOfficeId: 0,
      TotalAmountPaid: parseInt(item?.totalAmount),
      Narration: "Payment from PremiumTrust Bank",
      PaymentItemsPaid: PaymentItemsPaid,
    }).then(async (response) => {
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

  // to save reference numbers in premium database
  const saveReference = async (event, item, bankpaymentreference) => {
    const url = `http://192.168.207.18:8091/SaveDebitTransRef?TransactionReference=${bankpaymentreference}&EcashReference=${item?.transactionReference}`;
    await axios
      .post(url)
      .then((response) =>
        console.log(response, "response from savedReference")
      );
  };

  // to move the declined transaction to decline tab
  const handleDecline = async (event, item) => {
    console.log(item, "iminkwa");
    const url = `http://192.168.207.18:8091/AuthorisedCashData?AuthorizedBy=${
      user.name
    }&DateAuthorized=${date}&TransactionReference=${
      item?.transactionReference
    }&_STATUS=${2}`;
    await axios.post(url).then((response) => {
      console.log(response, "response from authorizer");
      handleDeclineRequest(event, item);
    });
  };
  // function to decline transaction {entire flow of encryption, call api and decryption}
  const handleDeclineRequest = async (event, item) => {
    let result;
    await encryptPayload({
      BankBranchCode: userDetails.branchCode,
      TransactionReference: item?.transactionReference,
      BankPaymentReference: item?.transactionReference,
      TransactionStatusId: 3,
      PaymentMethodId: 1,
      PaymentChannelId: 1,
      IsChequeTransaction: false,
      IsThirdPartyCheque: false,
      ChequeIssuingBankCode: "",
      ChequeNo: "",
      ChequeDate: "",
      DebitAccName: "TellerTill",
      DebitAccNo: "11110111111",
      DepositorName: "TestTeller",
      DepositorSlipNo: item?.depositorSlipNo,
      PostedBy: "TellerTill",
      TerminalId: "",
      TaxOfficeId: 0,
      TotalAmountPaid: parseInt(item?.totalAmount),
      Narration: "Payment from PremiumTrust Bank",
      PaymentItemsPaid: [],
    }).then(async (response) => {
      result = await declineTransaction(response.data);
      console.log({ result });
    });
    return result;
  };
  const declineTransaction = async (searchParams) => {
    const url = `https://test.xpresspayments.com:9015/api/ApiGateway/PaymentNotification?request=${searchParams}`;
    let result;
    await axios
      .post(url)
      .then(async (response) => {
        console.log(response.data, "response from decline request");
        // window.alert(response.data.responseMessage);
        window.alert("Transaction has been declined");
        result = await decryptResponse(response.data.data);
        console.log("decrypted result", result);
      })
      .catch((erroror) => console.log(erroror));
    return result;
  };

  const decryptResponse = async (encryptedData) => {
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
                    Payer Name
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-semibold text-gray-500 uppercase"
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
                    className="text-sm font-semibold text-gray-500 uppercase"
                  >
                    initiated by
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
                        <td className="p-4 whitespace-nowrap text-center">
                          {item?.transactionReference}
                        </td>
                        <td className="p-4 whitespace-nowrap text-center">
                          {item?.totalAmount}
                        </td>
                        <td className="p-4 whitespace-nowrap text-center">
                          {item?.requestDate}
                        </td>
                        <td className="p-4 whitespace-nowrap text-center">
                          {item?.initialisedBy}
                        </td>
                        <td className="p-4 whitespace-nowrap text-center text-yellow-400">
                          {getStatus(item?.status)}
                        </td>
                        <td>
                          <div className="flex items-center justify-center">
                            <div
                              className="m-2 cursor-pointer"
                              onClick={(e) => handleAction(e, item)}
                            >
                              <TiTick size={30} className="text-green-500" />
                            </div>
                            <div className="m-2 cursor-pointer">
                              <RiDeleteBack2Fill
                                size={20}
                                className="text-red-600"
                                onClick={(e) => handleDecline(e, item)}
                              />
                            </div>
                          </div>
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
