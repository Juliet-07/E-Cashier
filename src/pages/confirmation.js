// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import Logo from "../assets/ptbLogo.png";

// const Confirmation = () => {
//   const { handleSubmit } = useForm();
//   const url = "http://192.168.207.18:8091/CreateECashData";
//   const createData = () => {
//     const _items = [];
//     paymentItemDetails.forEach((item) => {
//       const _itemsObject = {
//         PaymentItemName: item.PaymentItemName,
//         Amount: String(item.Amount),
//         PaymentItemCode: item.PaymentItemCode,
//       };
//       _items.push(_itemsObject);
//     });
//     setPayerDetails({ ...payerDetails, item: _items });
//     console.log(payerDetails, "engine oka");
//     axios.post(url, payerDetails).then((response) => {
//       console.log(response.data, "response here for creating data");
//       alert("Transaction Completed");
//     });
//   };
//   return (
//     <>
//       <div className="flex flex-col items-center justify-center">
//         <div className="w-[300px] h-[150px]">
//           <img src={Logo} alt="Premium Trust Bank" />
//         </div>
//         <div className="font-bold text-xl text-red-600">Confirmation Page</div>
//         <div className="w-[500px] h-full rounded-xl shadow-2xl border my-10 border-red-600 bg-white">
//           <div className="h-full shadow-xl mx-20 mb-10 border rounded border-red-600 text-red-600 font-medium text-sm p-4">
//             <form className="m-4" onSubmit={handleSubmit(createData)}>
//               <div className="flex flex-wrap -mx-3 mb-6">
//                 <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
//                   <label
//                     className="block tracking-wide text-black text-xs font-bold mb-2"
//                     htmlFor="grid-first-name"
//                   >
//                     Payer Name
//                   </label>
//                   <input
//                     className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
//                     id="grid-first-name"
//                     type="text"
//                     name="PayerName"
//                     value={PayerName}
//                     readOnly
//                   />
//                 </div>
//                 <div className="w-full md:w-1/2 px-3">
//                   <label
//                     className="block tracking-wide text-black text-xs font-bold mb-2"
//                     htmlFor="email"
//                   >
//                     Email
//                   </label>
//                   <input
//                     className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
//                     id="email"
//                     type="text"
//                     name="PayerEmail"
//                     value={PayerEmail}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>
//               <div className="flex flex-wrap -mx-3 mb-6">
//                 <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
//                   <label
//                     className="block tracking-wide text-black text-xs font-bold mb-2"
//                     htmlFor="number"
//                   >
//                     Phone Number
//                   </label>
//                   <input
//                     className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
//                     id="number"
//                     type="text"
//                     name="PayerPhone"
//                     value={PayerPhone}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="w-full md:w-1/2 px-3">
//                   <label
//                     className="block tracking-wide text-gray-700 text-xs font-bold mb-2"
//                     htmlFor="address"
//                   >
//                     Address
//                   </label>
//                   <input
//                     className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
//                     id="grid-last-name"
//                     type="text"
//                     name="PayerAddress"
//                     value={PayerAddress}
//                   />
//                 </div>
//               </div>
//               <div className="flex flex-wrap -mx-3 mb-6">
//                 <table className="w-full border border-red-600">
//                   <thead className="bg-gray-50 h-[60px]">
//                     <tr>
//                       <th className="text-sm font-semibold text-black">
//                         Payment Items
//                       </th>
//                       <th className="text-sm font-semibold text-black">
//                         Payment Amount
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {paymentItemDetails.length > 0 &&
//                       paymentItemDetails.map((item, index) => {
//                         return (
//                           <tr key={index}>
//                             <td className="p-4 whitespace-nowrap text-left text-black">
//                               {item.PaymentItemName}
//                             </td>
//                             <td>
//                               <input
//                                 className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
//                                 type="text"
//                                 name="Amount"
//                                 value={item.Amount}
//                                 disabled={item.PartPaymentAllowed === false}
//                               />
//                             </td>
//                           </tr>
//                         );
//                       })}
//                   </tbody>
//                 </table>
//               </div>
//               <div className="flex flex-wrap -mx-3 mb-6">
//                 <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
//                   <label
//                     className="block tracking-wide text-black text-xs font-bold mb-2"
//                     htmlFor="total"
//                   >
//                     Total Amount
//                   </label>
//                   <input
//                     className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
//                     id="total"
//                     type="text"
//                     name="Amount"
//                     value={Amount}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="w-full md:w-1/2 px-3">
//                   <label
//                     className="block tracking-wide text-gray-700 text-xs font-bold mb-2"
//                     htmlFor="period"
//                   >
//                     Payment Period
//                   </label>
//                   <input
//                     className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
//                     id="period"
//                     type="text"
//                     name="PaymentPeriod"
//                     value={PaymentPeriod}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>
//               <div className="flex flex-wrap -mx-3 mb-6">
//                 <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
//                   <label
//                     className="block tracking-wide text-black text-xs font-bold mb-2"
//                     htmlFor="fee"
//                   >
//                     Depositor Slip Number
//                   </label>
//                   <input
//                     className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
//                     id="fee"
//                     type="text"
//                     name="DepositorSlipNo"
//                     value={DepositorSlipNo}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="w-full md:w-1/2 px-3">
//                   <label
//                     className="block tracking-wide text-gray-700 text-xs font-bold mb-2"
//                     htmlFor="comment"
//                   >
//                     Payment reason/comment
//                   </label>
//                   <input
//                     className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
//                     id="comment"
//                     type="text"
//                     name="Comment"
//                     value={Comment}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>
//               <div className="flex flex-wrap -mx-3 mb-6">
//                 <div className="w-full md:w-1/2 px-3">
//                   <label
//                     htmlFor="initializer"
//                     className="block mb-2 text-sm font-medium text-gray-900"
//                   >
//                     Initialised By
//                   </label>
//                   <input
//                     className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
//                     id="initializer"
//                     type="text"
//                     name="InitialisedBy"
//                     value={InitialisedBy}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="w-full md:w-1/2 px-3">
//                   <label
//                     htmlFor="branchcode"
//                     className="block mb-2 text-sm font-medium text-gray-900"
//                   >
//                     Branch Code
//                   </label>
//                   <input
//                     className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
//                     id="branchcode"
//                     type="text"
//                     name="Branch_Code"
//                     value={Branch_Code}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>
//               <div className="flex flex-wrap -mx-3 mb-6">
//                 <div className="w-full md:w-1/2 px-3">
//                   <label
//                     htmlFor="transactionReference"
//                     className="block mb-2 text-sm font-medium text-gray-900"
//                   >
//                     Transaction Reference
//                   </label>
//                   <input
//                     className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
//                     id="transactionReference"
//                     type="text"
//                     value={TransactionReference}
//                     readOnly
//                   />
//                 </div>
//                 <div className="w-full md:w-1/2 px-3">
//                   <label
//                     htmlFor="date"
//                     className="block mb-2 text-sm font-medium text-gray-900"
//                   >
//                     Date
//                   </label>
//                   <input
//                     className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
//                     id="date"
//                     type="text"
//                     required
//                     name="Date"
//                     placeholder="dd-mm-yy"
//                     value={Date}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>
//               <div className="flex items-end justify-end m-4">
//                 <button className="text-white bg-red-600 hover:bg-red-700 hover:font-bold font-medium text-sm p-2.5 text-center w-[200px]">
//                   Complete Transaction
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Confirmation;
