const express = require("express");
const httpProxy = require("express-http-proxy");
const cors = require("cors");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
const SERVICE_LAYER_HOST = "192.168.3.10";
const SERVICE_LAYER_PORT = "50000";
const PORT = 3000;
const SAP_SERVICE_URL = `https://${SERVICE_LAYER_HOST}:${SERVICE_LAYER_PORT}/b1s/v1`;
const agent = new https.Agent({
  rejectUnauthorized: false,
});

app.use(cors());
app.use(bodyParser.json()); 

app.use(
  "/b1s/v1",
  httpProxy(SAP_SERVICE_URL, {
    proxyReqPathResolver: (req) => {
      return req.originalUrl;
    },
    proxyReqOptDecorator: (proxyReqOpts) => {
      proxyReqOpts.agent = agent;
      return proxyReqOpts;
    },
  })
);

app.listen(PORT, () => {
  console.log(`Gateway service layer running at http://localhost:${PORT}`);
});
