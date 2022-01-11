import { fieldBuilder } from '@via-profit-services/core';
import type { CountryResolver } from '@via-profit-services/geography';

const countryResolver = fieldBuilder<CountryResolver>(
  ['id', 'en', 'ru', 'iso3', 'iso2', 'phoneCode', 'currency', 'capital'],
  field => async (parent, _args, context) => {
    const { id } = parent;
    const { dataloader } = context;
    const country = await dataloader.geography.countries.load(id);

    return country[field];
  },
);

export default countryResolver;
