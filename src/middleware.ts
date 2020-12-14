import { Middleware } from '@via-profit-services/core';
import { GeographyMiddlewareFactory } from '@via-profit-services/geography';

import dataloaderFacroty from './dataloaders';
import resolvers from './resolvers';
import typeDefs from './schema.graphql';

const geographyFactory: GeographyMiddlewareFactory = () => {

  const middleware: Middleware = ({ context }) => ({
      context: {
        ...context,
        dataloader: {
          ...context.dataloader, // original dataloaders
          ...dataloaderFacroty(context), // append account dataloaders
        },
      },
    })

  return {
    middleware,
    resolvers,
    typeDefs,
  }
};

export default geographyFactory;
