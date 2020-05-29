import { IResolverObject, IFieldResolver } from 'graphql-tools';

import createDataloaders from '../loaders';
import { Context, ICity } from '../types';


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
  state: () => ({}),
  stateCode: () => ({}),
  latitude: () => ({}),
  longitude: () => ({}),
}, {
  get: (target, prop: keyof ICity) => {
    const resolver: IFieldResolver<IParent, Context> = async (parent, args, context) => {
      const { id } = parent;
      const loaders = createDataloaders(context);
      const city = await loaders.cities.load(id);

      return city[prop];
    };

    return resolver;
  },
});

export default driverResolver;
