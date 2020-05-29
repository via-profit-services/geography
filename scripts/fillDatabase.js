/* eslint-disable import/no-extraneous-dependencies */
const chalk = require('chalk');
const dotenv = require('dotenv');
const Knex = require('knex');
const lodash = require('lodash');
const cities = require('../converted/cities.json');
const countries = require('../converted/countries.json');
const states = require('../converted/states.json');

dotenv.config();

const bootstrap = async () => {
  // fill countries
  const knex = Knex({
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
  });

  // countries
  const countriesChunks = lodash.chunk(countries, Math.floor(countries.length / 50));
  await knex('citiesListCountries').del();

  await countriesChunks.reduce(async (prev, chunk, currentIndex) => {
    await prev;
    console.log(chalk.magenta(`citiesListCountries.Chunk ${currentIndex} from ${countriesChunks.length - 1}`));
    return knex('citiesListCountries').insert(chunk);
  }, Promise.resolve());

  // states
  const statesChunks = lodash.chunk(states, Math.floor(states.length / 50));
  await statesChunks.reduce(async (prev, chunk, currentIndex) => {
    await prev;
    console.log(chalk.magenta(`citiesListStates.Chunk ${currentIndex} from ${statesChunks.length - 1}`));
    return knex('citiesListStates').insert(chunk);
  }, Promise.resolve());

  // cities
  const citiesChunks = lodash.chunk(cities, Math.floor(cities.length / 50));
  await citiesChunks.reduce(async (prev, chunk, currentIndex) => {
    await prev;
    console.log(chalk.magenta(`citiesListCities.Chunk ${currentIndex} from ${citiesChunks.length - 1}`));
    return knex('citiesListCities').insert(chunk);
  }, Promise.resolve());

  console.log(chalk.green('Done'));

  knex.destroy();
};

bootstrap();
