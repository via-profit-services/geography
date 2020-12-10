import { Middleware, GraphqlMiddleware, Context } from '@via-profit-services/core';
import { GeographyMiddlewareFactory } from '@via-profit-services/geography';

import dataloaderFacroty from './dataloaders';
import resolvers from './resolvers';
import typeDefs from './typeDefs';

const geographyFactory: GeographyMiddlewareFactory = () => {
  const middleware: Middleware = () => {
    const graphqlMiddleware: GraphqlMiddleware = async (resolve, parent, args, context, info) => {
      const composedContext: Context = {
        ...context,
        dataloader: {
          ...context.dataloader, // original dataloaders
          ...dataloaderFacroty(context), // append account dataloaders
        },
      };

      return await resolve(parent, args, composedContext, info);
    };

    return graphqlMiddleware;
  }

  return {
    typeDefs,
    resolvers,
    middleware,
  }
};

export default geographyFactory;
