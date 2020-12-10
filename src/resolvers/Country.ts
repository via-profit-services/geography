import type { IObjectTypeResolver, IFieldResolver } from '@graphql-tools/utils';
import type { Context } from '@via-profit-services/core';
import type { Country } from '@via-profit-services/geography';

interface Parent {
  id: string;
}

interface Source {
  id: string;
}

const CoutryResolver = new Proxy<IObjectTypeResolver<Source, Context>>({
  id: () => ({}),
  en: () => ({}),
  ru: () => ({}),
  iso3: () => ({}),
  iso2: () => ({}),
  phoneCode: () => ({}),
  currency: () => ({}),
  capital: () => ({}),
}, {
  get: (_target, prop: keyof Country) => {
    const resolver: IFieldResolver<Parent, Context> = async (parent, _args, context) => {
      const { id } = parent;
      const { dataloader } = context;
      const country = await dataloader.geography.countries.load(id);

      return country[prop];
    };

    return resolver;
  },
});

export default CoutryResolver;
