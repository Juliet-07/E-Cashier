import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { PiSignOutBold } from "react-icons/pi";
import {
  decryptPayload,
  encryptPayload,
} from "../../services/encryption.service";

const AuthorizerLandingPage = () => {
  const baseURL = import.meta.env.VITE_REACT_APP_BASEURL;
  const [user, setUser] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [userDetails, setUserDetails] = useState({});

  const infoCards = [
    {
      description: "Total no. of payments",
      figure: "222222",
    },
    {
      description: "Pending Payments",
      figure: transactions.length,
    },
    {
      description: "Approved Transactions",
      figure: "4444444",
    },
  ];

  const getUserDetail = async (givenname) => {
    const url = `${baseURL}/GetUserDetail?UserID=${givenname}`;
    axios.get(url).then(async (response) => {
      const data = response.data.result;
      console.log({ data });
      setUserDetails(data);
      console.log(userDetails, "user-details");
      const { branchCode } = data;
      if (branchCode) await fetchPendingTransaction(branchCode);
    });
  };

  const fetchPendingTransaction = async (branchCode) => {
    const url = `${baseURL}/GetPendingTransaction?Auth_BRANCH_CODE=${branchCode}`;
    try {
      await axios.get(url).then((response) => {
        console.log(response.data.result, "pending transaction");
        setTransactions(response.data.result);
      });
    } catch (error) {
      console.log(error);
    }
  };

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
  return (
    <>
      <Navbar />
      <div className="py-4 px-20">
        <div className="flex items-center text-[#B72727]">
          <PiSignOutBold />
          <p className="mx-2">Sign out</p>
        </div>
        <div className="my-10 grid grid-cols-3">
          {infoCards.map((card) => (
            <div className="bg-white rounded-xl w-[320.4px] h-[149.6px] border shadow-lg flex items-center px-6">
              <div className="w-[75px] h-[75px] border-[3px] border-[#B72727] rounded-xl mr-4"></div>
              <div className="">
                <p className="font-medium text-[#232323] font-mono text-sm">
                  {card.description}
                </p>
                <p className="font-bold font-sans">{card.figure}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Table */}
        <div className="p-4 flex flex-col items-center justify-center bg-white rounded shadow-lg border">
          <div className="w-full flex items-center justify-between mb-4">
            <div></div>
            <form>
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute top-0 bottom-0 w-6 h-6 my-auto text-black left-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search"
                  className="w-[528px] h-10 py-3 pl-12 pr-4 text-gray-50 border rounded-md outline-none bg-[#FAFAFA] focus:bg-white"
                />
              </div>
            </form>
          </div>
          <table className="w-full table bg-white text-sm text-left text-gray-500 dark:text-gray-400 px-4 divide-y-4">
            <thead className="text-xs font-mono text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="p-4">Payer's Name</th>
                <th className="p-4">Reference No.</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Date</th>
                <th className="p-4">Initiated By</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
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
                      <td className="p-4 whitespace-nowrap">
                        {item?.totalAmount}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {item?.requestDate}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {item?.initialisedBy}
                      </td>
                      <td className="p-4 whitespace-nowrap">status</td>
                      <td className="text-[#B72727] rounded-xl text-center">
                        View
                      </td>
                      {/* <td className="p-4 whitespace-nowrap text-yellow-400">
                        {getStatus(item?.status)}
                      </td> */}
                      {/* <td>
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
                      </td> */}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AuthorizerLandingPage;
