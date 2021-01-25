import { IFieldResolver } from '@graphql-tools/utils';
import { Context, buildQueryFilter, buildCursorConnection, InputFilter, ServerError } from '@via-profit-services/core';

import GeographyService from '../GeographyService';

const CitiesListConnection: IFieldResolver<any, Context, InputFilter> = async (
  _parent,
  args,
  context,
) => {
  const { logger, dataloader } = context;
  const filter = buildQueryFilter(args);
  const citiesListService = new GeographyService({ context });

  try {
    const citiesConnection = await citiesListService.getCities(filter);
    const connection = buildCursorConnection(citiesConnection, 'cities');

    citiesConnection.nodes.forEach((node) => {
      dataloader.geography.cities.prime(node.id, node);
    });

    return connection;
  } catch (err) {
    logger.server.error('Failed to get Cities list', { err });
    throw new ServerError('Failed to get Cities list', { err });
  }
};

export default CitiesListConnection;
