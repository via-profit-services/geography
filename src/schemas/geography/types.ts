import { IContext } from '@via-profit-services/core';

export type Context = Pick<IContext, 'knex' | 'timezone' | 'logger'>;


export interface ICountry {
  id: string;
  name: string;
  iso3: string;
  iso2: string;
  phoneCode: string;
  currency: string;
  capital?: string;
}

export interface IState {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  stateCode: string;
}

export interface ICity {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  state: string;
  stateCode: string;
  latitude: string;
  longitude: string;
}
