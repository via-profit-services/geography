import type { StateResolver } from '@via-profit-services/geography';

const stateResolver = new Proxy<StateResolver>({
  id: () => ({}),
  en: () => ({}),
  ru: () => ({}),
  country: () => ({}),
  countryCode: () => ({}),
  stateCode: () => ({}),
}, {
  get: (_target, prop: keyof StateResolver) => {
    const resolver: StateResolver[keyof StateResolver] = async (parent, _args, context) => {
      const { id } = parent;
      const { dataloader } = context;
      const state = await dataloader.geography.states.load(id);

      return state[prop];
    };

    return resolver;
  },
});

export default stateResolver;
