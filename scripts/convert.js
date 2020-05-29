/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
/**
 * This code will be convert JSON files from repository https://github.com/dr5hn/countries-states-cities-database
 * to another JSON files with UUID v4 IDs and «CamelCase» fields
 */


const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const translate = require('translation-google');
const uuidv4 = require('uuid').v4;
const cities = require('../source/cities');
const countries = require('../source/countries');
const states = require('../source/states');

const replacements = {
  countries: {},
  states: {},
};


console.log(chalk.yellow('Starting'));
const bootstrap = async () => {
  const newCities = cities.map((city) => {
    replacements.countries[city.country_id] = replacements.countries[city.country_id] || uuidv4();
    replacements.states[city.state_id] = replacements.states[city.state_id] || uuidv4();

    return {
      id: uuidv4(),
      name: city.name,
      ru: city.name,
      country: replacements.countries[city.country_id],
      countryCode: city.country_code,
      state: replacements.states[city.state_id],
      stateCode: city.state_code,
      latitude: city.latitude,
      longitude: city.longitude,
    };
  });


  const newCountries = countries.map((country) => {
    const capital = newCities.find((c) => c.name === country.capital);

    replacements.countries[country.id] = replacements.countries[country.id] || uuidv4();

    return {
      id: replacements.countries[country.id],
      name: country.name,
      ru: country.name,
      iso3: country.iso3,
      iso2: country.iso2,
      phoneCode: country.phone_code,
      capital: capital ? capital.id : null,
      currency: country.currency,
    };
  });

  const newStates = states.map((state) => {
    return {
      id: replacements.states[state.id] || uuidv4(),
      name: state.name,
      ru: state.name,
      country: replacements.countries[state.country_id],
      countryCode: state.country_code,
      stateCode: state.state_code,
    };
  });

  fs.writeFileSync(path.resolve('./converted/cities.json'), JSON.stringify(newCities));
  fs.writeFileSync(path.resolve('./converted/countries.json'), JSON.stringify(newCountries));
  fs.writeFileSync(path.resolve('./converted/states.json'), JSON.stringify(newStates));

  console.log(chalk.green('Done'));
};


bootstrap();
