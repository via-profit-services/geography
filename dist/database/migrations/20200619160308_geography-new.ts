/* eslint-disable import/no-extraneous-dependencies */
import * as Knex from 'knex';


export async function up(knex: Knex): Promise<any> {
  return knex.raw(`
    truncate table "geographyCities" cascade;
    truncate table "geographyStates" cascade;
    truncate table "geographyCountries" cascade;

    alter table "geographyCities" drop column "name";
    alter table "geographyStates" drop column "name";
    alter table "geographyCountries" drop column "name";
    
    alter table "geographyCities" drop column "ru";
    alter table "geographyStates" drop column "ru";
    alter table "geographyCountries" drop column "ru";
    
    alter table "geographyCities" add column "timezone" varchar(60) NOT NULL;
    alter table "geographyCities" add column "en" varchar(100) NOT NULL;
    alter table "geographyStates" add column "en" varchar(100) NOT NULL;
    alter table "geographyCountries" add column "en" varchar(100) NOT NULL;

    alter table "geographyCities" add column "ru" varchar(100) NOT NULL;
    alter table "geographyStates" add column "ru" varchar(100) NOT NULL;
    alter table "geographyCountries" add column "ru" varchar(100) NOT NULL;
  `);
}


export async function down(knex: Knex): Promise<any> {
  return knex.raw(`

    truncate table "geographyCities" cascade;
    truncate table "geographyStates" cascade;
    truncate table "geographyCountries" cascade;
    
    alter table "geographyCities" drop column "timezone" cascade;
    alter table "geographyCities" drop column "en";
    alter table "geographyStates" drop column "en";
    alter table "geographyCountries" drop column "en";
    
    alter table "geographyCities" add column "name" varchar(100) NOT NULL;
    alter table "geographyStates" add column "name" varchar(100) NOT NULL;
    alter table "geographyCountries" add column "name" varchar(100) NOT NULL;

  `);
}
