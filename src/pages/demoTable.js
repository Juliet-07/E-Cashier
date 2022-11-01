import React, { useState, useEffect } from "react";
import Head from "next/head";
import NavDashboard from "../components/navbarDashboard";
import Layout from "../components/layout";
import moment from "moment";
import styles from "../styles/Home.module.css";

const History = () => {
  const [user, setUser] = useState("");
  const [transactions, setTransactions] = useState([]);
  const formatDate = (value) => {
    return moment(value).format("HH:MM A DD, MM, YYYY");
  };
  const getType = (type) => {
    let typeClass;
    switch (type) {
      case "deposit":
        typeClass = "capitalize text-blue-500";
        break;

      case "withdrawal":
        typeClass = "capitalize text-red-500";
        break;

      // default: //pending
      //   typeClass = "text-warning";
      //   break;
    }
    return typeClass;
  };
  const getStatus = (status) => {
    let statusClass;
    switch (status) {
      case "approved":
        statusClass = "capitalize text-success";
        break;

      case "failed":
        statusClass = "capitalize text-danger";
        break;

      default: //pending
        statusClass = "capitalize text-warning";
        break;
    }
    return statusClass;
  };
  useEffect(() => {
    const fetchTransactionData = async () => {
      const user = JSON.parse(localStorage.getItem("Juliet"));
      if (user !== null || user !== undefined) {
        setUser(user);
      }
      try {
        await fetch(
          `https://monnayfinance.online/api/transactions/${user.id}`,
          {
            headers: {
              Authorization:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTgsInByaXZpbGVnZSI6InVzZXIiLCJ0b2tlbiI6Ijg5NGUzNDQzYjYzYzkyOTMiLCJpYXQiOjE2NTkwMDcxMjl9.oYKsguhTfAdWOZlURIJ3VIXZT0bX6UGNDpVrlKkhXEc",
              "Content-type": "application/json",
            },
          }
        )
          .then((res) => res.json())
          .then((data) => {
            const response = [...[], ...data?.data];
            console.log({ response });

            setTransactions(response);
            console.log({ transactions });
          });
      } catch (err) {
        setTransactions([]);
        console.log(err);
      }
    };
    fetchTransactionData();
  }, []);
  return (
    <>
      <Head>
        <title>MonnayFinance</title>
        <meta name="description" content="Generated monnay finance" />
        <link rel="icon" href="/icon.png" />
        <link
          href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css"
        />
      </Head>
      <Layout>
        <NavDashboard />
        {/* Content */}
        <div className="main-panel">
          <div className="historyHeader" id={styles.historyHeader}>
            <p className="historyHeaderText" id={styles.historyHeaderText}>
              Transaction History
            </p>
          </div>
          <div className="w-full max-w-4xl bg-white shadow-lg rounded-sm border border-gray-200 relative md:left-[318px]">
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="text-xl text-bold bg-white">
                  <tr>
                    <th className="24 p-2 whitespace-nowrap">Type</th>
                    <th className="20 p-2 whitespace-nowrap">Amount</th>
                    <th className="20 p-2 whitespace-nowrap">Date</th>
                    <th className="32 p-2 whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                  {transactions.length > 0 &&
                    transactions.map((item, index) => (
                      <tr key={index}>
                        <td className={getType(item?.type)}>{item?.type}</td>
                        <td className="p-2 whitespace-nowrap">
                          ${item?.amount}
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          {formatDate(item?.date)}
                        </td>
                        <td className={getStatus(item?.transactionStatus)}>
                          {item?.transactionStatus}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* <footer className="footer" id={styles.footer}>
          <p className="footer-text" id={styles.footerText}>
            COPYRIGHT MONNAYFINANCE 2022 - TERMS & CONDITIONS PRIVACY POLICY
          </p>
        </footer> */}
        {/* Content Ends*/}
      </Layout>
    </>
  );
};
export default History;
