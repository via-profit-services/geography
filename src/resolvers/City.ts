import type { CityResolver } from '@via-profit-services/geography';

const cityResolver = new Proxy<CityResolver>({
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
  get: (_target, prop: keyof CityResolver) => {
    const resolver: CityResolver[keyof CityResolver] = async (parent, _args, context) => {
      const { id } = parent;
      const { dataloader } = context;
      const city = await dataloader.geography.cities.load(id);

      return city[prop];
    };

    return resolver;
  },
});

export default cityResolver;
