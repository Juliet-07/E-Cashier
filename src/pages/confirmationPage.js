import React from "react";
import Logo from "../assets/ptbLogo.png";

const ConfirmationPage = () => {
  //   const router = useRouter();
  //   console.log(router.query);
  //   const accountNumber = router.query?.accountNumber;
  return (
    <div className="w-full h-full">
      <div className="w-[250px] h-[50px]">
        <img src={Logo} alt="premiumLogo" />
      </div>
      <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
        <div className="w-full p-6 m-auto bg-white border-t border-red-600 rounded shadow-lg shadow-red-600/70 lg:max-w-md">
          <h1 className="font-semibold text-center text-xl text-red-600">
            Confirmation Page
          </h1>
          <form className="mt-6">
            <div className="mt-4">
              <label htmlFor="account" className="block text-sm text-gray-800">
                Account Number
              </label>
              <input
                type="text"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-red-400 focus:ring-red-300 focus:outline-none focus:ring focus:ring-opacity-40"
                // value={accountNumber ? accountNumber : ""}
              />
            </div>
            <div className="mt-4">
              <label
                htmlFor="accountType"
                className="block text-sm text-gray-800"
              >
                Account Type
              </label>
              <input
                type="text"
                // value={data.accountType}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-red-400 focus:ring-red-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="account" className="block text-sm text-gray-800">
                Name
              </label>
              <input
                type="text"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-red-400 focus:ring-red-300 focus:outline-none focus:ring focus:ring-opacity-40"
                // value={data.customerName}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="address" className="block text-sm text-gray-800">
                Address
              </label>
              <input
                type="text"
                // value={data.address}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-red-400 focus:ring-red-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="account" className="block text-sm text-gray-800">
                Customer ID
              </label>
              <input
                type="text"
                // value={data.customerNo}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-red-400 focus:ring-red-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="account" className="block text-sm text-gray-800">
                Sex
              </label>
              <input
                type="text"
                // value={data.gender}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-red-400 focus:ring-red-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="account" className="block text-sm text-gray-800">
                Branch
              </label>
              <input
                type="text"
                // value={data.branchName}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-red-400 focus:ring-red-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="account" className="block text-sm text-gray-800">
                Name On Card
              </label>
              <input
                type="text"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-red-400 focus:ring-red-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
            <div className="mt-6">
              <button
                onClick={() => alert("Request Sent")}
                className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-red-700 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ConfirmationPage;
