/* eslint-disable import/no-extraneous-dependencies */
/**
 * This code will be download JSON files from repository https://github.com/dr5hn/countries-states-cities-database
 * into the `/source` directory
 */

const fs = require('fs');
const https = require('https');
const path = require('path');
const chalk = require('chalk');

const repository = 'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/raw';

const files = {
  'cities.json': `${repository}/cities.json`,
  'states.json': `${repository}/states.json`,
  'countries.json': `${repository}/countries.json`,
};

Object.entries(files).forEach(async ([filename, sourceFilename]) => {
  try {
    const destinationFile = fs.createWriteStream(path.resolve(__dirname, `../source/${filename}`));
    https.get(sourceFilename, (response) => {
      response.pipe(destinationFile);
      console.log(chalk.green(`File ${sourceFilename} was downloaded successfully`));
    });
  } catch (err) {
    console.log(chalk.red(`Failed to download file ${sourceFilename}`));
    console.error(err);
  }
});
