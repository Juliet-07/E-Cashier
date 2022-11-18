import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  decryptPayload,
  encryptPayload,
} from "../shared/services/e-cashier-encryption.service";

const Table = () => {
  // branch code of the authorizer that logs in
  const branchCode = "000";

  const [transactions, setTransactions] = useState([]);

  const [controlNo, setControlNo] = useState("");

  // to get details from database and render on table.
  useEffect(() => {
    const fetchApprovedTransaction = async () => {
      try {
        await axios
          .get(
            `http://192.168.207.18:8091/GetApprovedTransaction?Auth_BRANCH_CODE=${branchCode}`
          )
          .then((response) => {
            console.log(response.data.result, "Approved transaction");
            setTransactions(response.data.result);
          });
      } catch (err) {
        console.log(err);
      }
    };
    fetchApprovedTransaction();
  }, []);

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

  // function to use merchant details across application
  const getMerchantDetails = () => {
    return JSON.parse(localStorage.getItem("Merchant"));
  };

  // function to handle printing receipt
  const handleRequest = async (event, item) => {
    let result;
    // console.log("data From row", item);
    await encryptPayload({
      MerchantId: getMerchantDetails().MerchantId,
      BranchCode: "001",
      TransactionReference: item?.transactionReference,
      ControlNo: controlNo,
    }).then(async (response) => {
      result = await printReceipt(response.data);
      console.log({ result });
      const url = window.URL.createObjectURL(new Blob([result]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "transaction_receipt.pdf"); //or any other extension
      document.body.appendChild(link);
      link.click();
    });
    return result;
  };

  const printReceipt = async (searchParams) => {
    const url = `http://80.88.8.239:9011/api/Receipt/PrintReceipt?request=${searchParams}`;
    let result;
    await axios
      .post(url)
      .then(async (response) => {
        console.log(response.data, "response from print receipt");
        window.alert(response.data.responseMessage);
        // result = await handleDecrypt(response.data);
        // console.log("decrypted result", result);
      })
      .catch((error) => console.log(error));
    // return result;
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
                        <td className="p-4 whitespace-nowrap text-center text-green-500">
                          {getStatus(item?.status)}
                        </td>
                        <td>
                          <input
                            placeholder="Control No."
                            type="text"
                            className=" text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                            name="controlNo"
                            value={controlNo}
                            onChange={(e) => setControlNo(e.target.value)}
                          />

                          <button
                            type="submit"
                            onClick={(e) => handleRequest(e, item)}
                            className="text-white bg-red-600 hover:bg-red-700 hover:font-bold font-semibold text-sm p-2.5 text-center w-[130px] h-[50px]"
                          >
                            Print Receipt
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