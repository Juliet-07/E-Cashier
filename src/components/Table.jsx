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
  // branch code of the authorizer that logs in (make it dynamic)
  const branchCode = "000";

  const [transactions, setTransactions] = useState([]);

  // to get details from database and render on table.
  useEffect(() => {
    const fetchPendingTransaction = async () => {
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
    fetchPendingTransaction();
  }, []);

  const getStatus = (status) => {
    let statusClass;
    switch (status) {
      case "approved":
        statusClass = "Failed";
        break;

      case "pending":
        statusClass = "Approved";
        break;

      default: //failed
        statusClass = "Pending";
        break;
    }
    return statusClass;
  };

  // to access user
  const [user, setUser] = useState("");
  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem("Username"));
  //   if (user !== null || user !== undefined) {
  //     setUser(user);
  //   }
  // }, []);

  const handleAction = async (event, item) => {
    await handleAuthorize(event, item);
    await handleDebit();
    await handleRequest(event, item);
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
  const handleDebit = async () => {
    const url = "http://192.168.207.18:8085/api/Account/PostTransaction";
    try {
      const payload = {
        amount: 3000,
        sourceAccount: "160501000",
        destinationAccount: "0070000018",
        applyFee: true,
        narration: "Deployed test",
        fees: [
          {
            account: "160501000",

            amount: 30,

            narration: "Deployed Trans",
          },

          {
            account: "160501000",

            amount: 10,

            narration: "Test Trans",
          },
        ],
      };
      await axios.post(url, payload).then((response) => {
        console.log(response, "response from debit api");
        window.alert(response.data.respMsg);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // function to send notification to XpressPay
  const handleRequest = async (event, item) => {
    let result;
    console.log("data From row", item);
    await encryptPayload({
      BankBranchCode: "001",
      TransactionReference: item?.transactionReference,
      BankPaymentReference: "008ACWN222770001",
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
      PostedBy: "unknown",
      TerminalId: "",
      TaxOfficeId: 0,
      TotalAmountPaid: parseInt(item?.amount),
      Narration: "Payment from Premium",
      PaymentItemsPaid: [
        { PaymentItemCode: "402-6(III)", Amount: 400000 },
        // { PaymentItemCode: "402-22(xv)", Amount: 0 },
      ],
    }).then(async (response) => {
      result = await paymentNotification(response.data);
      console.log({ result });
    });
    return result;
  };

  const paymentNotification = async (searchParams) => {
    const url = `http://80.88.8.239:9011/api/ApiGateway/PaymentNotification?request=${searchParams}`;
    let result;
    await axios
      .post(url)
      .then(async (response) => {
        console.log(response.data, "response from post request");
        result = await handleDecrypt(response.data.data);
        console.log("decrypted result", result);
      })
      .catch((erroror) => console.log(erroror));
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
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 h-[60px]">
                <tr>
                  <th
                    scope="col"
                    className="text-sm font-semibold text-gray-500 uppercase"
                  >
                    Name
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
                        <td className="p-4 whitespace-nowrap text-center">
                          {item?.payerName}
                        </td>
                        <td className="p-4 whitespace-nowrap text-center">
                          {item?.transactionReference}
                        </td>
                        <td className="p-4 whitespace-nowrap text-center">
                          {item?.amount}
                        </td>
                        <td className="p-4 whitespace-nowrap text-center">
                          {item?.date}
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
                              className="m-2"
                              onClick={(e) => handleAction(e, item)}
                            >
                              <TiTick size={30} className="text-green-500" />
                            </div>
                            <div className="m-2">
                              <RiDeleteBack2Fill
                                size={20}
                                className="text-red-600"
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
