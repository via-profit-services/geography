import { IFieldResolver } from '@graphql-tools/utils';
import { Context, buildQueryFilter, buildCursorConnection, InputFilter, ServerError } from '@via-profit-services/core';

import GeographyService from '../GeographyService';

const StatesListConnection: IFieldResolver<any, Context, InputFilter> = async (
  _parent,
  args,
  context,
) => {
  const { logger } = context;
  const filter = buildQueryFilter(args);
  const statesListService = new GeographyService({ context });
  const { dataloader } = context;

  try {
    const statesConnection = await statesListService.getStates(filter);
    const connection = buildCursorConnection(statesConnection, 'states');

    statesConnection.nodes.forEach((node) => {
      dataloader.geography.states.prime(node.id, node);
    });

    return connection;
  } catch (err) {
    logger.server.error('Failed to get States list', { err });
    throw new ServerError('Failed to get States list', { err });
  }
};

export default StatesListConnection;
