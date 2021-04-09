declare module '@via-profit-services/geography' {
  import { Context, OutputFilter, ListResponse, Middleware } from '@via-profit-services/core';

  export interface GeographyServiceProps {
    context: Context;
  }

  export type GeographyMiddlewareFactory = () => Middleware;

  export interface Country {
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

  export interface State {
    id: string;
    en: string;
    ru: string;
    country: {
      id: string;
    };
    countryCode: string;
    stateCode: string;
  }


  export interface City {
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


  export type CitiesTableRecord = {
    readonly id: string;
    readonly ru: string;
    readonly en: string;
    readonly country: string;
    readonly countryCode: string;
    readonly state: string;
    readonly stateCode: string;
    readonly latitude: string;
    readonly longitude: string;
    readonly timezone: string;
  }

  export type CountriesTableRecord = {
    readonly id: string;
    readonly ru: string;
    readonly en: string;
    readonly iso3: string;
    readonly iso2: string;
    readonly phoneCode: string;
    readonly currency: string;
    readonly capital: string | null;
  }

  export type StatesTableRecord = {
    readonly id: string;
    readonly ru: string;
    readonly en: string;
    readonly country: string;
    readonly stateCode: string;
    readonly countryCode: string;
  }

  export type CitiesTableRecordResult = CitiesTableRecord & {
    readonly totalCount: number;
  };
  export type CountriesTableRecordResult = CountriesTableRecord & {
    readonly totalCount: number;
  };
  export type StatesTableRecordResult = StatesTableRecord & {
    readonly totalCount: number;
  };



  class GeographyService {
    props: GeographyServiceProps;
    constructor(props: GeographyServiceProps);
    getCities(filter: Partial<OutputFilter>): Promise<ListResponse<City>>;
    getCitiesByIds(ids: string[]): Promise<City[]>;
    getCity(id: string): Promise<City | false>;
    getStates(filter: Partial<OutputFilter>): Promise<ListResponse<State>>;
    getSatatesByIds(ids: string[]): Promise<State[]>;
    getState(id: string): Promise<State | false>;
    getCountries(filter: Partial<OutputFilter>): Promise<ListResponse<Country>>;
    getCountriesByIds(ids: string[]): Promise<Country[]>;
    getCountry(id: string): Promise<Country | false>;
  }

  export const typeDefs: string;
  export const resolvers: any;
  export const factory: GeographyMiddlewareFactory;
}

declare module '@via-profit-services/core' {
  import DataLoader from 'dataloader';
  import { Country, State, City, GeographyService } from '@via-profit-services/geography';

  interface DataLoaderCollection {
    geography: {
      countries: DataLoader<string, Node<Country>>;
      states: DataLoader<string,  Node<State>>;
      cities: DataLoader<string,  Node<City>>;
    }
  }

  interface ServicesCollection {
    geography: GeographyService;
  }
}

