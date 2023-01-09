import React, { useState, useEffect } from "react";
import axios from "axios";

const Table = () => {
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
        if (branchCode) await fetchRejectedTransaction(branchCode);
      });
  };

  const fetchRejectedTransaction = async (branchCode) => {
    try {
      await axios
        .get(
          `http://192.168.207.18:8091/GetRejectedTransaction?Auth_BRANCH_CODE=${branchCode}`
        )
        .then((response) => {
          console.log(response.data.result, "Rejected transaction");
          setTransactions(response.data.result);
        });
    } catch (err) {
      console.log(err);
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
        statusClass = "Rejected";
        break;
    }
    return statusClass;
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
                    className="text-sm font-semibold text-gray-500 uppercase text-right"
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
                        <td className="p-4 whitespace-nowrap text-center text-red-600">
                          {getStatus(item?.status)}
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
