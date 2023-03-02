import axios from "axios";
import CryptoJS from "crypto-js";

var uuid = require("uuid");

// const { CLIENT_KEY, CLIENT_SECRET } = process.env();

export const hashedRequest = async ({ method, body, baseUrl }) => {
  console.log(baseUrl);
  try {
    // var baseUrl = "http://192.168.207.18:8091"
    var clientKey = "d3895ad6-aa2c-40e3-bd55-68a5bb98fb56";
    // var clientKey = CLIENT_KEY;
    var clientSecret = "XMaMUxW5WHBKVYg3G524K4WMKtWnJJA+oqqnEAGhLXA=";
    // var clientSecret = CLIENT_SECRET;
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
