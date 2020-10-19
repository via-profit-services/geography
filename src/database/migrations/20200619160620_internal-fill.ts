/* eslint-disable import/no-extraneous-dependencies */
import { Knex } from '@via-profit-services/core';

import * as by from '../../countries/BY';
import * as ru from '../../countries/RU';

const list = [by, ru];

export async function up(knex: Knex): Promise<any> {
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

export async function down(knex: Knex): Promise<any> {
  return knex.raw(`
    -- delete from "geographyCities";
    -- delete from "geographyStates";
    -- delete from "geographyCountries";
  `);
}
