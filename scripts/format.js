/* eslint-disable import/no-extraneous-dependencies */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');


const files = fs.readdirSync(path.resolve('./src/countries'));

const formatCountry = async (countryCode) => {
  return new Promise((resolve) => {
    const cities = spawn('yarn', ['prettier', '--write', `./src/countries/${countryCode}/cities.json`]);
    spawn('yarn', ['prettier', '--write', `./src/countries/${countryCode}/countries.json`]);
    spawn('yarn', ['prettier', '--write', `./src/countries/${countryCode}/states.json`]);

    cities.on('exit', () => {
      console.log(chalk.yellow(`${countryCode} was formatted`));
      resolve();
    });
  });
};


const bootstrap = async () => {
  console.log(chalk.yellow('Start'));
  await files.reduce(async (prev, current) => {
    await prev;
    await formatCountry(current);
  }, Promise.resolve());

  console.log(chalk.green('Finish'));
};


bootstrap();
