const cp = require('child_process');
const path = require('path');


const restartCronfig = () => {
  const tmpRestartFile = path.resolve(__dirname, '../.tmp/restart.txt');
  cp.execSync(`touch ${tmpRestartFile}`);
};

module.exports = { loadUpCrons, appendCronfig, getCronfig, setUpDefaultCronfig, restartCronfig };
