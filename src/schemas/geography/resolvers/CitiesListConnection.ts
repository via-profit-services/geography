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

const CitiesListConnection: IFieldResolver<any, Context, TInputFilter> = async (
  parent, args, context,
) => {
  const { logger } = context;
  const filter = buildQueryFilter(args);
  const citiesListService = new GeographyService({ context });
  const loaders = createLoaders(context);

  try {
    const citiesConnection = await citiesListService.getCities(filter);
    const connection = buildCursorConnection(citiesConnection, 'cities');

    loaders.cities.clearAll();

    citiesConnection.nodes.forEach((node) => {
      loaders.cities.prime(node.id, node);
    });

    return connection;
  } catch (err) {
    logger.server.error('Failed to get Cities list', { err });
    throw new ServerError('Failed to get Cities list', { err });
  }
};

export default CitiesListConnection;
