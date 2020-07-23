/* eslint-disable import/no-extraneous-dependencies */
import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.raw(`
    -- clear tables
    truncate table "geographyCities" cascade;
    truncate table "geographyStates" cascade;
    truncate table "geographyCountries" cascade;

    alter table "geographyCities" add column "timezone" varchar(60) NOT NULL;
  `);
}

export async function down(knex: Knex): Promise<any> {
  return knex.raw(`
    -- clear tables
    truncate table "geographyCities" cascade;
    truncate table "geographyStates" cascade;
    truncate table "geographyCountries" cascade;

    alter table "geographyCities" drop column "timezone" cascade;

  `);
}
