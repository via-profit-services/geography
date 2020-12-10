import type { IObjectTypeResolver, IFieldResolver } from '@graphql-tools/utils';
import type { Context } from '@via-profit-services/core';
import type { City } from '@via-profit-services/geography';

interface Parent {
  id: string;
}

interface Source {
  id: string;
}

const CityResolver = new Proxy<IObjectTypeResolver<Source, City>>({
  id: () => ({}),
  en: () => ({}),
  ru: () => ({}),
  country: () => ({}),
  countryCode: () => ({}),
  state: () => ({}),
  stateCode: () => ({}),
  latitude: () => ({}),
  longitude: () => ({}),
  timezone: () => ({}),
}, {
  get: (target, prop: keyof City) => {
    const resolver: IFieldResolver<Parent, Context> = async (parent, args, context) => {
      const { id } = parent;
      const { dataloader } = context;
      const city = await dataloader.geography.cities.load(id);

      return city[prop];
    };

    return resolver;
  },
});

export default CityResolver;
