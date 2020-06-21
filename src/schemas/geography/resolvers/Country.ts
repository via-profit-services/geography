import { IResolverObject, IFieldResolver } from 'graphql-tools';

import createDataloaders from '../loaders';
import { Context, ICountry } from '../types';


type TDriverResolver = IResolverObject<{ id: string; }, Context>;

interface IParent {
  id: string;
}

const driverResolver = new Proxy<TDriverResolver>({
  id: () => ({}),
  en: () => ({}),
  ru: () => ({}),
  iso3: () => ({}),
  iso2: () => ({}),
  phoneCode: () => ({}),
  currency: () => ({}),
  capital: () => ({}),
}, {
  get: (target, prop: keyof ICountry) => {
    const resolver: IFieldResolver<IParent, Context> = async (parent, args, context) => {
      const { id } = parent;
      const loaders = createDataloaders(context);
      const country = await loaders.countries.load(id);

      return country[prop];
    };

    return resolver;
  },
});

export default driverResolver;
