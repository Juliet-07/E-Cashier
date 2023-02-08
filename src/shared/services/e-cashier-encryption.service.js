// const { default: axios } = require("axios");
import axios from "axios";

/** Encrypt and decrypt payload over e-cashier server */
const ENCRYPTION_URL = "https://test.xpresspayments.com:9015/api/ApiGateway/EncryptRequest";
const DECRYPTION_URL = "https://test.xpresspayments.com:9015/api/ApiGateway/DecryptRequest";

export const encryptPayload = async (payload) => {
  const url = `${ENCRYPTION_URL}?request=${JSON.stringify(payload)}`;
  const requestBody = {};
  return await axios
    .post(url, requestBody)
    .then((response) => {
      const data = response.data;
      return data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const decryptPayload = async (payload) => {
  const url = `${DECRYPTION_URL}`;
  const requestBody = {
    request: payload,
  };
  return await axios
    .post(url, requestBody)
    .then((response) => {
      const data = response.data;
      return data;
    })
    .catch((error) => {
      console.log(error);
    });
};
