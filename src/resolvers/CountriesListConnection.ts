import { IFieldResolver } from '@graphql-tools/utils';
import { buildQueryFilter, buildCursorConnection, InputFilter, ServerError, Context } from '@via-profit-services/core';

import GeographyService from '../GeographyService';


const CountriesListConnection: IFieldResolver<any, Context, InputFilter> = async (
  _parent,
  args,
  context,
) => {
  const { logger } = context;
  const filter = buildQueryFilter(args);
  const countriesListService = new GeographyService({ context });
  const { dataloader } = context;

  try {
    const countriesConnection = await countriesListService.getCountries(filter);
    const connection = buildCursorConnection(countriesConnection, 'countries');

    countriesConnection.nodes.forEach((node) => {
      dataloader.geography.countries.prime(node.id, node);
    });

    return connection;
  } catch (err) {
    logger.server.error('Failed to get Countries list', { err });
    throw new ServerError('Failed to get Countries list', { err });
  }
};

export default CountriesListConnection;
