/* eslint-disable import/no-extraneous-dependencies */
/**
 * This code will be convert JSON files from repository https://github.com/dr5hn/countries-states-cities-database
 * to another JSON files with UUID v4 IDs and «CamelCase» fields
 */

// console.log('Do not execute this code');
// process.exit(0);
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const cities = require('../converted/cities');
const countries = require('../converted/countries');
const states = require('../converted/states');

const splitTo = countries.map((country) => country.iso2);
const splitDir = path.resolve(__dirname, '../src/countries');

splitTo.forEach((countryCode) => {
  const destinationPath = path.resolve(splitDir, countryCode);

  if (fs.existsSync(destinationPath)) {
    rimraf.sync((destinationPath));
  }

  fs.mkdirSync(destinationPath, { recursive: true });

  const newCountries = countries.filter((country) => country.iso2 === countryCode);
  const newStates = states.filter((state) => state.countryCode === countryCode);
  const newCities = cities.filter((city) => city.countryCode === countryCode);

  fs.writeFileSync(`${destinationPath}/countries.json`, JSON.stringify(newCountries));
  fs.writeFileSync(`${destinationPath}/cities.json`, JSON.stringify(newCities));
  fs.writeFileSync(`${destinationPath}/states.json`, JSON.stringify(newStates));

  const indexTs = `
import cities from './cities.json';
import countries from './countries.json';
import states from './states.json';

export { countries, states, cities };
`;

  fs.writeFileSync(path.resolve(destinationPath, 'index.ts'), indexTs);
});
