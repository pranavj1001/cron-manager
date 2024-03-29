const express = require("express");
const fileUpload = require('express-fileupload');
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cron = require("node-cron");

const path = require("path");
const util = require("util");

const {
  restartCronfig,
  getCronfig,
  appendCronfig,
  checkIfTaskConfigExists,
  loadUpCrons,
  popCronfig
} = require('./cron-config');

const cronsFolder = path.join(__dirname, '../crons');
const tmpFolder = path.join(__dirname, '../.tmp');

const port = 3691;
const SUCCESS_HTTP_CODE = 200;
const SERVER_ERROR_CODE = 500;
const BAD_REQ_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
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

    req.files = Object.assign({}, req.files);
    console.log(req.files);
    req.body = Object.assign({}, req.body);
    console.log(req.body);

    // check the request body
		if (
			!req.files ||
			Object.keys(req.files).length === 0 ||
			!req.files["files[]"]
		) {
			res.status(BAD_REQ_ERROR_CODE).json({...errorResponse, status: BAD_REQ_ERROR_CODE, resp: `Crons not found. No files were uploaded.`});
      return;
		}

    if (!req.body || !req.body.expression || !req.body.name) {
      res.status(BAD_REQ_ERROR_CODE).json({...errorResponse, status: BAD_REQ_ERROR_CODE, resp: `Request Body is not in proper format`});
      return;
    }

    // save the cron in fs
    let files = [];
		if (Array.isArray(req.files["crons"])) {
			console.log("multiple files upload");
			files = req.files["files[]"];
		} else {
			console.log("single file upload");
			files.push(req.files["files[]"]);
		}

    const requestBody = req.body;
		for (const file of files) {
			console.log(file);
			const uploadPath = `${cronsFolder}/${requestBody.name}/${file.name}`;
			file.mv(uploadPath, (err) => {
				if (err) {
					res.status(SERVER_ERROR_CODE).json({...errorResponse, resp: `Error occurred while uploading ${file.name} on ${uploadPath}`});
					return;
				}
				console.log(`File: ${file.name} was successfully uploaded on ${uploadPath}`);
			});

      // schedule the cron
      cron.schedule(requestBody.expression, () => {
        const cp = require("child_process");
        cp.execSync(`node "${uploadPath}"`);
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

app.get("/crons", (req, res) => {
  try {
    const activeCronfig = JSON.parse(getCronfig());
    res.status(SUCCESS_HTTP_CODE).json({...successResponse, resp: activeCronfig});
	} catch(e) {
		res.status(SERVER_ERROR_CODE).json({...errorResponse, resp: getAndPrintErrorString(req.url, e)});
	}
});

app.delete("/cron", (req, res) => {
  try {
    console.log(req.body);
    if (!req.body || !req.body.length || req.body.length <= 0) {
      res.status(BAD_REQ_ERROR_CODE).json({...errorResponse, status: BAD_REQ_ERROR_CODE, resp: `Request Body is not in proper format`});
      return;
    }

    const tasksConfig = JSON.parse(getCronfig());
    let deletedConfig = false;
    for (const deletedItem of req.body) {
      if (tasksConfig && tasksConfig.length > 0 && checkIfTaskConfigExists(tasksConfig, {options: {name: deletedItem.options.name}})) {
        for (let i = 0; i < tasksConfig.length; i++) {
          if (tasksConfig[i].options.name === deletedItem.options.name && tasksConfig[i].cronFileName && deletedItem.cronFileName) {
            deletedConfig = popCronfig(tasksConfig, i);
          }
        }
      }
    }
    if (deletedConfig) {
      res.status(SUCCESS_HTTP_CODE).json({...successResponse, resp: 'Deleted Cron Successfully.'});
      restartCronfig();
      return;
    } else {
      res.status(NOT_FOUND_ERROR_CODE).json({...successResponse, resp: 'Cron Deletion Failed.'});
    }
	} catch(e) {
		res.status(SERVER_ERROR_CODE).json({...errorResponse, resp: getAndPrintErrorString(req.url, e)});
	}
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
