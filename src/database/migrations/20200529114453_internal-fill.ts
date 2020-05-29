/* eslint-disable import/no-extraneous-dependencies */
import * as Knex from 'knex';
import * as by from '../../countries/BY';
import * as kz from '../../countries/KZ';
import * as ru from '../../countries/RU';
import * as ua from '../../countries/UA';

const list = [kz, ru, ua, by];

export async function up(knex: Knex): Promise<any> {
  return knex.raw(`
    delete from "geographyCities";
    delete from "geographyStates";
    delete from "geographyCountries";
  `)
    .then(() => {
      return list.reduce(async (prev, { countries, states, cities }) => {
        await prev;
        await knex('geographyCountries').insert(countries);
        await knex('geographyStates').insert(states);
        await knex('geographyCities').insert(cities);
      }, Promise.resolve());
    });
}

export async function down(knex: Knex): Promise<any> {
  return knex.raw(`
    drop table "geographyCities" cascade;
    drop table "geographyStates" cascade;
    drop table "geographyCountries" cascade;
  `);
}
