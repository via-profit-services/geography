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

const StatesListConnection: IFieldResolver<any, Context, TInputFilter> = async (
  parent, args, context,
) => {
  const { logger } = context;
  const filter = buildQueryFilter(args);
  const statesListService = new GeographyService({ context });
  const loaders = createLoaders(context);

  try {
    const statesConnection = await statesListService.getStates(filter);
    const connection = buildCursorConnection(statesConnection, 'states');

    loaders.states.clearAll();

    statesConnection.nodes.forEach((node) => {
      loaders.states.prime(node.id, node);
    });

    return connection;
  } catch (err) {
    logger.server.error('Failed to get States list', { err });
    throw new ServerError('Failed to get States list', { err });
  }
};

export default StatesListConnection;
