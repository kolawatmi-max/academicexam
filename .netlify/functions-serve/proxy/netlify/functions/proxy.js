var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// netlify/functions/proxy.js
var proxy_exports = {};
__export(proxy_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(proxy_exports);
var handler = async (event) => {
  const { queryStringParameters } = event;
  const { action, payload } = queryStringParameters || {};
  if (!action) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing action parameter" })
    };
  }
  const APPS_SCRIPT_URL = process.env.EXAM_API_URL;
  const params = new URLSearchParams();
  params.set("action", action);
  if (payload) {
    params.set("payload", payload);
  }
  const url = `${APPS_SCRIPT_URL}?${params.toString()}`;
  try {
    const response = await fetch(url, { redirect: "follow" });
    const data = await response.json();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=proxy.js.map
