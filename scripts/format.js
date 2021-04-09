/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');


const files = fs.readdirSync(path.resolve('./data'));

const formatCountry = async (countryCode) => {
  return new Promise((resolve) => {
    let state = 0;
    const citiesFilename = `./data/${countryCode}/cities.json`;
    const countriesFilename = `./data/${countryCode}/countries.json`;
    const statesFilename = `./data/${countryCode}/states.json`;

    const countries = exec(`cat <<< $(jq . ${countriesFilename}) > ${countriesFilename}`);
    const states = exec(`cat <<< $(jq . ${statesFilename}) > ${statesFilename}`);
    const cities = exec(`cat <<< $(jq . ${citiesFilename}) > ${citiesFilename}`);

    const endEvent = () => {
      state += 1;
      if (state === 3) {
        console.log(`${countryCode} formatted`);
        resolve();
      }
    }

    countries.on('exit', endEvent);
    states.on('exit', endEvent);
    cities.on('exit', endEvent);
  });
};


const bootstrap = async () => {
  console.log('Start');
  await files.reduce(async (prev, current) => {
    await prev;
    await formatCountry(current);
  }, Promise.resolve());

  console.log('Finish');
};


bootstrap();