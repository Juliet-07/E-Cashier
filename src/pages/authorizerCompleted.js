import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/AuthorizerNavbar";
import Table from "../components/TableCompleted";

const Completed = () => {
  return (
    <>
      <Navbar />
      <div className="flex justify-between items-center mx-8 my-10">
        <div className="flex">
          <Link to="/authorizer">
            <div className="w-[160px] h-[50px] border border-yellow-300 text-center p-2 font-medium text-xl ml-4 bg-yellow-400">
              Pending
            </div>
          </Link>
          <Link to="/authorizerCompleted">
            <div className="w-[160px] h-[50px] border border-green-300 text-center p-2 font-medium text-xl bg-green-500">
              Completed
            </div>
          </Link>
          <Link to="/authorizerRejected">
            <div className="w-[160px] h-[50px] border border-red-600 text-center p-2 font-medium text-xl bg-red-600">
              Declined
            </div>
          </Link>
        </div>
        <div className="flex items-center justify-center">
          <form className="px-4">
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
                placeholder="Search Name or Reference"
                className="w-[350 px] py-3 pl-12 pr-4 text-gray-500 border rounded-md outline-none bg-gray-50 focus:bg-white"
              />
            </div>
          </form>
          <div>
            <button
              type="submit"
              className="text-white bg-red-600 hover:bg-red-700 hover:font-bold font-semibold text-sm p-2.5 text-center w-[100px] h-[50px]"
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="m-10">
        <Table />
      </div>
    </>
  );
};

export default Completed;
