const cron = require("node-cron");

const path = require("path");
const cronsFolder = path.join(__dirname, '../crons');

cron.schedule("*/5 * * * * *", () => {
  const cp = require("child_process");
  const fs = require("fs");
  fs.appendFileSync("./sample1.log", ` hello world ${(new Date())/1000} cp ${cp}`);
  cp.execSync(`node ${path.join(cronsFolder, './cron1.js')}`);
}, {scheduled: true});