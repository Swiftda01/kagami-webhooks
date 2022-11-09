const express = require("express");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");
const bodyParser = require("body-parser");
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;
const API_SERVICE_URL = process.env.API_SERVICE_URL;
const APPLICATION_ID = process.env.APPLICATION_ID;

console.log(PORT)

app.use(morgan("dev"));

app.use(bodyParser.json());

app.use(
  "/check_transaction_limit",
  createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      [`^/check_transaction_limit`]: "",
    },
    onProxyReq(proxyReq, req, res) {
      req.body._ApplicationId = APPLICATION_ID;
      let bodyData = JSON.stringify(req.body);
      console.log(bodyData);
      proxyReq.setHeader("Content-Type", "application/json");
      proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    },
  })
);

app.listen(PORT, () => {
  console.log(`Starting Proxy on port: ${PORT}`);
});
