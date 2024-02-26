import axios from "axios";

const baseURL = import.meta.env.VITE_REACT_APP_XPRESSPAY;

const ENCRYPTION_URL = `${baseURL}/EncryptRequest`;
const DECRYPTION_URL = `${baseURL}/DecryptRequest`;

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
