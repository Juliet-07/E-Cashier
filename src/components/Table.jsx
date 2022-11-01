import React, { useState, useEffect } from "react";
import axios from "axios";
import { TiTick } from "react-icons/ti";
import { RiDeleteBack2Fill } from "react-icons/ri";
import {
  decryptPayload,
  encryptPayload,
} from "../shared/services/e-cashier-encryption.service";

const people = [
  {
    name: "Jane Cooper",
    reference: "20151010789",
    amount: "40,000,000",
    image: "https://bit.ly/33HnjK0",
  },
  {
    name: "John Doe",
    reference: "20151010789",
    amount: "27,500,000",
    image: "https://bit.ly/3I9nL2D",
  },
  {
    name: "Veronica Lodge",
    reference: "20151010789",
    amount: " 100,000,000",
    image: "https://bit.ly/3vaOTe1",
  },
  // More people...
];

const Table = () => {
  // branch code of the authorizer that logs in
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
      } catch (err) {
        console.log(err);
      }
    };
    fetchPendingTransaction();
  }, []);

  // function to send notification to XpressPay
  const handleRequest = async (inputValue) => {
    console.log({ inputValue });
    let result;
    await encryptPayload({
      BankBranchCode: "XPS",
      TransactionReference: "1790080108008901",
      BankPaymentReference: "0099989717",
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
      DepositorSlipNo: "044754772",
      PostedBy: "unknown",
      TerminalId: "",
      TaxOfficeId: 0,
      TotalAmountPaid: 1000,
      Narration: "Payment from Access",
      PaymentItemsPaid: [{ PaymentItemCode: "4020184E", Amount: 1000 }],
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
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 h-[70px]">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-sm font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-sm font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Reference No.
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-sm font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-sm font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-sm font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-sm font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.length > 0
                  ? transactions.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{item?.payerName}</td>
                          <td>{item?.transactionReference}</td>
                          <td>{item?.amount}</td>
                          <td>{item?.date}</td>
                          <td></td>
                          <td className="flex">
                            <div className="m-2" onClick={handleRequest}>
                              <TiTick size={20} />
                            </div>
                            <div className="m-2">
                              <RiDeleteBack2Fill size={20} />
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Table;
