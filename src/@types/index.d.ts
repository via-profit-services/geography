declare module '@via-profit-services/geography' {
  import { Context, OutputFilter, ListResponse, Middleware } from '@via-profit-services/core';
  import { IResolvers } from '@graphql-tools/utils';
  import { DocumentNode } from 'graphql';

  export interface GeographyServiceProps {
    context: Context;
  }

  export type GeographyMiddlewareFactory = () => {
    typeDefs: DocumentNode;
    resolvers: IResolvers;
    middleware: Middleware;
  }

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


  export class GeographyService {
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

  const geographyMiddlewareFactory: GeographyMiddlewareFactory;
  export default geographyMiddlewareFactory;
}

declare module '@via-profit-services/core' {
  import DataLoader from 'dataloader';
  import { Country, State, City } from '@via-profit-services/geography';

  interface DataLoaderCollection {
    geography: {
      countries: DataLoader<string, Node<Country>>;
      states: DataLoader<string,  Node<State>>;
      cities: DataLoader<string,  Node<City>>;
    }
  }
}

