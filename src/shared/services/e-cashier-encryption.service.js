const { default: axios } = require("axios");

/** Encrypt and decrypt payload over e-cashier server */
const ENCRYPTION_URL = "http://80.88.8.239:9011/api/ApiGateway/EncryptRequest";
const DECRYPTION_URL = "http://80.88.8.239:9011/api/ApiGateway/DecryptRequest";

exports.encryptPayload = async (payload) => {
  const url = `${ENCRYPTION_URL}?request=${JSON.stringify(payload)}`;
  const requestBody = {};
  return await axios
    .post(url, requestBody)
    .then((response) => {
      const data = response.data;
    //   console.log(data);
      return data;
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.decryptPayload = async (payload) => {
  const url = `${DECRYPTION_URL}`;
  const requestBody = {
    request: payload,
  };
  await axios
    .post(url, requestBody)
    .then((response) => {
      const data = response.data;
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.log(error);
    });
};
