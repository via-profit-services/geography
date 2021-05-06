import { Resolvers } from '@via-profit-services/geography';

import City from './City';
import Country from './Country';
import GeographyQuery from './GeographyQuery';
import Query from './Query';
import State from './State';

const resolvers: Resolvers = {
  Query,
  GeographyQuery,
  City,
  State,
  Country,
};

export default resolvers;
