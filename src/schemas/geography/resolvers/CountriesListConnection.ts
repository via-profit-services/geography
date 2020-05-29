import {
  buildQueryFilter,
  buildCursorConnection,
  TInputFilter,
  ServerError,
} from '@via-profit-services/core';
import { IFieldResolver } from 'graphql-tools';

import createLoaders from '../loaders';
import GeographyService from '../service';
import { Context } from '../types';

const CountriesListConnection: IFieldResolver<any, Context, TInputFilter> = async (
  parent, args, context,
) => {
  const { logger } = context;
  const filter = buildQueryFilter(args);
  const countriesListService = new GeographyService({ context });
  const loaders = createLoaders(context);

  try {
    const countriesConnection = await countriesListService.getCountries(filter);
    const connection = buildCursorConnection(countriesConnection, 'countries');

    loaders.countries.clearAll();

    countriesConnection.nodes.forEach((node) => {
      loaders.countries.prime(node.id, node);
    });

    return connection;
  } catch (err) {
    logger.server.error('Failed to get Countries list', { err });
    throw new ServerError('Failed to get Countries list', { err });
  }
};

export default CountriesListConnection;
