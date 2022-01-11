import { fieldBuilder } from '@via-profit-services/core';
import type { CityResolver } from '@via-profit-services/geography';

const cityResolver = fieldBuilder<CityResolver>(
  [
    'id',
    'en',
    'ru',
    'country',
    'countryCode',
    'state',
    'stateCode',
    'latitude',
    'longitude',
    'timezone',
  ],
  field => async (parent, _args, context) => {
    const { id } = parent;
    const { dataloader } = context;
    const city = await dataloader.geography.cities.load(id);

    return city[field];
  },
);

export default cityResolver;
