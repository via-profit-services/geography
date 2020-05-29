import { IResolvers } from 'graphql-tools';

import { Context } from '../types';
import CitiesListConnection from './CitiesListConnection';
import City from './City';
import CountriesListConnection from './CountriesListConnection';
import Country from './Country';
import State from './State';
import StatesListConnection from './StatesListConnection';

const resolvers: IResolvers<any, Context> = {
  Query: {
    geography: () => ({}),
  },
  GeographyQuery: {
    cities: CitiesListConnection,
    states: StatesListConnection,
    countries: CountriesListConnection,
  },
  City,
  State,
  Country,
};

export default resolvers;
