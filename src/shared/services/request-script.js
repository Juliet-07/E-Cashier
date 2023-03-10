import axios from "axios";
import CryptoJS from "crypto-js";

var uuid = require("uuid");

export const hashedRequest = async ({ method, body, baseUrl }) => {
  try {
    var clientKey = process.env.REACT_APP_CLIENT_KEY;
    var clientSecret = process.env.REACT_APP_CLIENT_SECRET;
    var nonce = uuid.v4();
    var epoch = Math.floor(new Date().getTime() / 1000);
    // console.log("epochtime:  " + epoch);
    // console.log("clientSecret:  " + clientSecret);
    // var body = "";
    var md5 = "";
    if (method !== "GET") {
      // body = pm.request.body.toString();
      if (body !== "") {
        md5 = CryptoJS.enc.Base64.stringify(CryptoJS.MD5(JSON.stringify(body)));
      }
      console.log("MD5:   " + md5);
    }
    var cypher = clientKey + nonce + epoch + method + md5 + baseUrl;
    console.log("Cypher " + cypher);

    var signature = CryptoJS.enc.Base64.stringify(
      CryptoJS.HmacSHA256(cypher, CryptoJS.enc.Base64.parse(clientSecret))
    );
    // console.log("Signature:" + signature);
    const customHeader = {
      "X-ClientKey": clientKey,
      Authorization: "Checksum " + signature,
      "X-UnixTime": epoch,
      "X-Nounce": nonce,
      "Content-Type": "application/json",
    };

    const result = await axios({
      method,
      url: baseUrl,
      data: body,
      headers: customHeader,
    });
    return result;
  } catch (error) {
    console.error(error);
  }
};
