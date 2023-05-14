const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cron = require("node-cron");

const fs = require("fs");
const path = require("path");
const util = require("util");

const cronsFolder = path.join(__dirname, '../crons');

const port = 3691;
const SUCCESS_HTTP_CODE = 200;
const SERVER_ERROR_CODE = 500;
const BAD_REQ_ERROR_CODE = 400;
const successResponse = {
  status: SUCCESS_HTTP_CODE,
  statusMessage: "OK",
  resp: {},
}; 
const errorResponse = {
  status: SERVER_ERROR_CODE,
  statusMessage: "Error",
  resp: {},
};

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

const getAndPrintErrorString = (url, error) => {
  const errorString = `Exception occurred at ${url}, Details \n ${util.inspect(
    error
  )}`;
  console.error(errorString);
  return errorString;
};

app.post("/cron", (req, res) => {
  try {
    cron.schedule("*/5 * * * * *", () => {
      const cp = require("child_process");
      cp.execSync(`node ${path.join(cronsFolder, './cron1.js')}`);
    });

    res.status(SUCCESS_HTTP_CODE).json({...successResponse, resp: `cron created.`});
	} catch(e) {
		res.status(SERVER_ERROR_CODE).json({...errorResponse, resp: getAndPrintErrorString(req.url, e)});
	}
});

app.get("/listCrons", (req, res) => {
  res.sendStatus(501);
});

app.delete("/cron", (req, res) => {
  res.sendStatus(501);
});

app.get("/restart_server", (req, res) => {
  try {
  restartCronfig();
  res
    .status(SUCCESS_HTTP_CODE)
    .json({ ...successResponse, resp: "HEALTH OK!" });
  } catch(e) {
		res.status(SERVER_ERROR_CODE).json({...errorResponse, resp: getAndPrintErrorString(req.url, e)});
	}
});

app.get("/", (req, res) => {
  res
    .status(SUCCESS_HTTP_CODE)
    .json({ ...successResponse, resp: "HEALTH OK!" });
});

app.listen(port, () => {
  console.log(`cron-manager backend server initialized on port ${port}`);
  loadUpCrons();
});
