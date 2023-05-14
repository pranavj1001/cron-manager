const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const cron = require("node-cron");

const CONFIG_FILE = path.resolve(__dirname, '../config', 'config.json');
const cronsFolder = path.join(__dirname, '../crons');

const loadUpCrons = () => {
  const tasksConfig = JSON.parse(getCronfig());
  console.log(`Current tasksConfig ${tasksConfig}`);
  if (tasksConfig && tasksConfig.length > 0) {
    for (const task of tasksConfig) {
      console.log(`Scheduling Cron ${task.options.name} ${path.join(cronsFolder, task.cronFileName)} ${task.expression} ${task.cronFileName}`);
      cron.schedule(task.expression, () => {
        cp.execSync(`node ${path.join(cronsFolder, task.cronFileName)}`);
      }, { name: task.options.name });
    }
  } else {
    setUpDefaultCronfig();
  }
};

const getConfigObject = (expression, cronFileName, options) => {
  return {
    expression,
    cronFileName,
    options,
  }
};

const checkIfTaskConfigExists = (tasksConfig, currentTaskConfig) => {
  for (const task of tasksConfig) {
    if (task.options.name === currentTaskConfig.options.name) {
      return true;
    }
  }
  return false;
};

const appendCronfig = (expression, cronFileName, options) => {
  const currentTaskConfig = getConfigObject(expression, cronFileName, options);
  const tasksConfig = JSON.parse(getCronfig());
  if (checkIfTaskConfigExists(tasksConfig, currentTaskConfig)) {
    return [1, `Cron for ${currentTaskConfig.cronFileName} already exists. Not creating.`];
  }
  tasksConfig.push(currentTaskConfig);
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(tasksConfig));
  return [0, currentTaskConfig];

};

const getCronfig = () => {
  let config = fs.readFileSync(CONFIG_FILE).toString();
  if (!config || config === "") {
    setUpDefaultCronfig();
    config = "[]";
  }

  return config;
};

const setUpDefaultCronfig = () => {
  fs.writeFileSync(CONFIG_FILE, "[]");
};

const restartCronfig = () => {
  console.log('Restarting Cronfig!');
  const tmpRestartFile = path.resolve(__dirname, '../.tmp/restart.txt');
  cp.execSync(`touch ${tmpRestartFile}`);
  // loadUpCrons();
};

module.exports = { loadUpCrons, appendCronfig, getCronfig, setUpDefaultCronfig, restartCronfig };
