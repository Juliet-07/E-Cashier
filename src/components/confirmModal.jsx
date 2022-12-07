import React, { useState } from "react";
import { MdCancel } from "react-icons/md";

const Modal = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button
        className="bg-yellow-400 text-black
      font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Confirm Details
      </button>
      {showModal ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="w-[500px] h-full rounded-xl shadow-2xl border my-10 border-red-600 bg-white">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                  <div className="font-bold text-xl text-red-600">
                    Confirmation Page
                  </div>
                  <button
                    className="bg-transparent border-0 text-black text-2xl float-right"
                    onClick={() => setShowModal(false)}
                  >
                    <MdCancel />
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  <form className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 w-full">
                    <div>
                      <label
                        className="block tracking-wide text-black text-xs font-bold mb-2"
                        htmlFor="grid-first-name"
                      >
                        Payer Name
                      </label>
                      <input
                        className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                        id="grid-first-name"
                        type="text"
                        // name="PayerName"
                        // value={PayerName}
                        // readOnly
                      />
                    </div>
                    <div>
                      <label
                        className="block tracking-wide text-black text-xs font-bold mb-2"
                        htmlFor="grid-first-name"
                      >
                        Email
                      </label>
                      <input
                        className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                        id="grid-first-name"
                        type="text"
                        // name="PayerName"
                        // value={PayerName}
                        // readOnly
                      />
                    </div>
                    <div>
                      <label
                        className="block tracking-wide text-black text-xs font-bold mb-2"
                        htmlFor="grid-first-name"
                      >
                        Phone number
                      </label>
                      <input
                        className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                        id="grid-first-name"
                        type="text"
                        // name="PayerName"
                        // value={PayerName}
                        // readOnly
                      />
                    </div>
                    <div>
                      <label
                        className="block tracking-wide text-black text-xs font-bold mb-2"
                        htmlFor="grid-first-name"
                      >
                        Payment Items
                      </label>
                      <input
                        className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                        id="grid-first-name"
                        type="text"
                        // name="PayerName"
                        // value={PayerName}
                        // readOnly
                      />
                    </div>
                    <div>
                      <label
                        className="block tracking-wide text-black text-xs font-bold mb-2"
                        htmlFor="grid-first-name"
                      >
                        Amount
                      </label>
                      <input
                        className="w-full text-gray-700 border border-red-600 rounded py-3 px-4 mb-3"
                        id="grid-first-name"
                        type="text"
                        // name="PayerName"
                        // value={PayerName}
                        // readOnly
                      />
                    </div>
                  </form>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-white bg-green-500 active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Modal;
