import type { CountryResolver } from '@via-profit-services/geography';

const countryResolver = new Proxy<CountryResolver>({
  id: () => ({}),
  en: () => ({}),
  ru: () => ({}),
  iso3: () => ({}),
  iso2: () => ({}),
  phoneCode: () => ({}),
  currency: () => ({}),
  capital: () => ({}),
}, {
  get: (_target, prop: keyof CountryResolver) => {
    const resolver: CountryResolver[keyof CountryResolver] = async (parent, _args, context) => {
      const { id } = parent;
      const { dataloader } = context;
      const country = await dataloader.geography.countries.load(id);

      return country[prop];
    };

    return resolver;
  },
});

export default countryResolver;
