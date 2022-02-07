/* eslint-disable */
const fs = require('fs');
const path = require('path');

const initCWD = process.env.INIT_CWD;
const dataSource = path.resolve(__dirname, '../data');
const dataDestination = path.resolve(initCWD, './.data/geography');


// check data paths
if (!fs.existsSync(dataDestination)) {
  fs.mkdirSync(dataDestination, { recursive: true });
}

// copy data
fs.readdirSync(dataSource).forEach((countryCode) => {
  ['cities.json', 'countries.json', 'states.json'].forEach((filename) => {
    const sourceFile = path.resolve(dataSource, countryCode, filename);
    const destinationFile = path.resolve(dataDestination, countryCode, filename);

    if (!fs.existsSync(path.dirname(destinationFile))) {
      fs.mkdirSync(path.dirname(destinationFile), { recursive: true });
    }

    fs.copyFileSync(sourceFile, destinationFile);
  });
});
