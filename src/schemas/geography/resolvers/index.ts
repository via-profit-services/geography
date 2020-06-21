import { IResolvers } from 'graphql-tools';

import createLoaders from '../loaders';
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
    city: async (parent: {id: string}, args, context) => {
      const { id } = parent;
      const loaders = createLoaders(context);
      const city = await loaders.cities.load(id);

      return city || null;
    },
    country: async (parent: {id: string}, args, context) => {
      const { id } = parent;
      const loaders = createLoaders(context);
      const country = await loaders.countries.load(id);

      return country || null;
    },
    state: async (parent: {id: string}, args, context) => {
      const { id } = parent;
      const loaders = createLoaders(context);
      const state = await loaders.states.load(id);

      return state || null;
    },
  },
  City,
  State,
  Country,
};

export default resolvers;
