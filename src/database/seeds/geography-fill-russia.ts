/* eslint-disable import/prefer-default-export */
import Knex from 'knex';

import * as ru from '../../countries/RU';

const list = [ru];

// eslint-disable-next-line arrow-body-style
export async function seed(knex: Knex): Promise<any> {
  await knex.raw(`
    truncate table "geographyCountries" cascade;
    truncate table "geographyStates" cascade;
    truncate table "geographyCities" cascade;
  `);

  return list.reduce(async (prev, { countries, states, cities }) => {
    await prev;

    // insert countries
    await knex.raw(`
      ${knex('geographyCountries').insert(countries).toQuery()}
      on conflict ("id") do update set
      ${Object.keys(countries[0]).map((field) => `"${field}" = excluded."${field}"`).join(',')}
    `);

    // insert states
    await knex.raw(`
      ${knex('geographyStates').insert(states).toQuery()}
      on conflict ("id") do update set
      ${Object.keys(states[0]).map((field) => `"${field}" = excluded."${field}"`).join(', ')}
    `);

    // insert cities
    await knex.raw(`
      ${knex('geographyCities').insert(cities).toQuery()}
      on conflict ("id") do update set
      ${Object.keys(cities[0]).map((field) => `"${field}" = excluded."${field}"`).join(', ')}
    `);
  }, Promise.resolve());
}