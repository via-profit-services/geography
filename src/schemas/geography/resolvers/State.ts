import { IResolverObject, IFieldResolver } from 'graphql-tools';

import createDataloaders from '../loaders';
import { Context, IState } from '../types';


type TDriverResolver = IResolverObject<{ id: string; }, Context>;

interface IParent {
  id: string;
}

const driverResolver = new Proxy<TDriverResolver>({
  id: () => ({}),
  name: () => ({}),
  ru: () => ({}),
  country: () => ({}),
  countryCode: () => ({}),
  stateCode: () => ({}),
}, {
  get: (target, prop: keyof IState) => {
    const resolver: IFieldResolver<IParent, Context> = async (parent, args, context) => {
      const { id } = parent;
      const loaders = createDataloaders(context);
      const state = await loaders.states.load(id);

      return state[prop];
    };

    return resolver;
  },
});

export default driverResolver;
