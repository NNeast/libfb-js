import FacebookApiHttpRequest from "./FacebookApiHttpRequest";
import * as crypto from "crypto";
import fetch from "node-fetch";

/**
 * This class wil implement making sick fucking http requests to facebook API by ZUCC.
 * Plz kill me
 * @todo https://github.com/chyla/Kadu/blob/master/plugins/facebook_protocol/qfacebook/http/qfacebook-http-api.cpp#L107
 */
export default class BaseFacebookHttpApi {
  deviceId: string;
  async get(request: FacebookApiHttpRequest) {
    request.params["api_key"] = "256002347743983";
    request.params["device_id"] = this.deviceId;
    request.params["fb_api_req_friendly_name"] = request.friendlyName;
    request.params["format"] = "json";
    request.params["method"] = request.method;
    request.params["local"] = "pl_PL";
    let dataToHash = request.sortedKeys().map(k => k + "=" + request.params[k]).join(""); // This isn't the same as request.serializeParams(), because no & sign and no escaping. Thanks ZUCC
    dataToHash += "374e60f8b9bb6b8cbb30f78030438895"; // ??? xDDDDDD wtf XD
    const sig = crypto
      .createHash("md5")
      .update(dataToHash)
      .digest("hex");
    request.params["sig"] = sig;

    const resultingUrl = request.url
    let extraHeaders = {};
    if (request.token) {
      extraHeaders["Authorization"] = "OAuth " + request.token;
    }
    const resp = await fetch(resultingUrl, {
      headers: {
        "User-Agent":
          "Facebook plugin / LIBFB-JS / [FBAN/Orca-Android;FBAV/38.0.0.22.155;FBBV/14477681]",
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        ...extraHeaders
      },
      method: 'POST',
      body: request.serializeParams()
    });
    if (!resp.ok) {
      throw new Error("Facebook get error: " + (await resp.text()));
    }
    return resp;
  }

  
}