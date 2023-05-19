const axios = require("axios");
const Env = require("./env");

const $axios = axios.create({
  baseURL: Env.backendApi,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    // "X-API-KEY": ENV.showwcaseAPIKey,
    // Authorization: `Bearer ${ENV.showwcaseToken}`,
  },
  withCredentials: true,
});

module.exports = $axios;
