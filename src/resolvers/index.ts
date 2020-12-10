import { IResolvers } from '@graphql-tools/utils';

import City from './City';
import Country from './Country';
import GeographyQuery from './GeographyQuery';
import Query from './Query';
import State from './State';

const resolvers: IResolvers = {
  Query,
  GeographyQuery,
  City,
  State,
  Country,
};

export default resolvers;
