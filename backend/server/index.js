const express = require("express");
const fileUpload = require('express-fileupload');
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cron = require("node-cron");

const fs = require("fs");
const path = require("path");
const util = require("util");

const {
  restartCronfig,
  getCronfig,
  appendCronfig,
  loadUpCrons
} = require('./cron-config');

const cronsFolder = path.join(__dirname, '../crons');
const tmpFolder = path.join(__dirname, '../.tmp');

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
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : tmpFolder,
	createParentPath: true,
	limits: { fileSize: 50 * 1024 * 1024 }
}));
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

    console.log(req.files);

    // check the request body
		if (
			!req.files ||
			Object.keys(req.files).length === 0 ||
			!req.files["crons"]
		) {
			res.status(BAD_REQ_ERROR_CODE).json({...errorResponse, status: BAD_REQ_ERROR_CODE, resp: `Crons not found. No files were uploaded.`});
      return;
		}

    if (!req.body || !req.body.expression || !req.body.cronFileName || !req.body.name) {
      res.status(BAD_REQ_ERROR_CODE).json({...errorResponse, status: BAD_REQ_ERROR_CODE, resp: `Request Body is not in proper format`});
      return;
    }

    // save the cron in fs
    let files = [];
		if (Array.isArray(req.files["crons"])) {
			console.log("multiple files upload");
			files = req.files["crons"];
		} else {
			console.log("single file upload");
			files.push(req.files["crons"]);
		}

    let cronFileName = "";
		for (const file of files) {
			console.log(file);
			const uploadPath = `${cronsFolder}/${file.name}`;
      cronFileName = file.name;
			file.mv(uploadPath, (err) => {
				if (err) {
					res.status(SERVER_ERROR_CODE).json({...errorResponse, resp: `Error occurred while uploading ${file.name} on ${uploadPath}`});
					return;
				}
				console.log(`File: ${file.name} was successfully uploaded on ${uploadPath}`);
			});

      // schedule the cron
      const requestBody = req.body;
      cron.schedule(requestBody.expression, () => {
        const cp = require("child_process");
        cp.execSync(`node ${path.join(cronsFolder, cronFileName)}`);
      }, { name: requestBody.name });

      // save the cron config
      [statusCode, statusResponse] = appendCronfig(requestBody.expression, file.name, { name: requestBody.name });

      if (statusCode === 1) {
        res.status(SERVER_ERROR_CODE).json({...errorResponse, resp: statusResponse});
        return;
      }
		}

    res.status(SUCCESS_HTTP_CODE).json({...successResponse, resp: `Cron Successfully Created`});
	} catch(e) {
		res.status(SERVER_ERROR_CODE).json({...errorResponse, resp: getAndPrintErrorString(req.url, e)});
    restartCronfig();
	}
});

app.get("/listCrons", (req, res) => {
  try {
    const activeCronfig = getCronfig();
    res.status(SUCCESS_HTTP_CODE).json({...successResponse, resp: activeCronfig});
	} catch(e) {
		res.status(SERVER_ERROR_CODE).json({...errorResponse, resp: getAndPrintErrorString(req.url, e)});
	}
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
