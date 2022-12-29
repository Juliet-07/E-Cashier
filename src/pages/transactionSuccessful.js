import React from "react";
import { Link } from "react-router-dom";
import { TiTick } from "react-icons/ti";

const TransactionSuccessful = () => {
  return (
    <>
      <div className="w-full h-screen flex items-center justify-center">
        <div className="w-[500px] h-[500px] flex flex-col items-center justify-center shadow-xl shadow-red-400 border rounded-[10px]">
          <div className="w-[150px] h-[150px] flex items-center justify-center m-4 rounded-full border-red-600 border-[8px]">
            <TiTick className="text-5xl text-red-600" />
          </div>
          <div className=" font-bold text-3xl mx-4">Transaction Successful</div>
          <div className="w-[357px] h-[66px] font-medium text-base mt-4 text-center">
            Transaction has been successfully completed and notification sent to
            authorizer.
          </div>
          <Link to="/landingpage">
            <div className="w-[150px] h-[50px] bg-red-600 mt-8 text-center pt-3 text-white font-bold rounded-xl">
              OK
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default TransactionSuccessful;
