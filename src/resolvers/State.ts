import type { IObjectTypeResolver, IFieldResolver } from '@graphql-tools/utils';
import type { Context } from '@via-profit-services/core';
import type { State } from '@via-profit-services/geography';

interface Parent {
  id: string;
}

interface Source {
  id: string;
}


const StateResolver = new Proxy<IObjectTypeResolver<Source, Context>>({
  id: () => ({}),
  en: () => ({}),
  ru: () => ({}),
  country: () => ({}),
  countryCode: () => ({}),
  stateCode: () => ({}),
}, {
  get: (_target, prop: keyof State) => {
    const resolver: IFieldResolver<Parent, Context> = async (parent, _args, context) => {
      const { id } = parent;
      const { dataloader } = context;
      const state = await dataloader.geography.states.load(id);

      return state[prop];
    };

    return resolver;
  },
});

export default StateResolver;
