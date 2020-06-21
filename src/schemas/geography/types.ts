import { IContext } from '@via-profit-services/core';

export type Context = Pick<IContext, 'knex' | 'timezone' | 'logger'>;


export interface ICountry {
  id: string;
  en: string;
  ru: string;
  iso3: string;
  iso2: string;
  phoneCode: string;
  currency: string;
  capital: {
    id: string;
  } | null;
}

export type ICountryPlaneInput = Omit<ICountry, 'capital'> & {
  capital: string;
};

export interface IState {
  id: string;
  en: string;
  ru: string;
  country: {
    id: string;
  };
  countryCode: string;
  stateCode: string;
}

export type IStatePlaneInput = Omit<IState, 'country'> & {
  country: string;
};

export interface ICity {
  id: string;
  en: string;
  ru: string;
  country: {
    id: string;
  };
  countryCode: string;
  state: {
    id: string;
  };
  stateCode: string;
  latitude: string;
  longitude: string;
}

export type ICityPlaneInput = Omit<ICity, 'country' | 'state'> & {
  country: string;
  state: string;
};
