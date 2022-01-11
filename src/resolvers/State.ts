import { fieldBuilder } from '@via-profit-services/core';
import type { StateResolver } from '@via-profit-services/geography';

const stateResolver = fieldBuilder<StateResolver>(
  ['id', 'en', 'ru', 'country', 'countryCode', 'stateCode'],
  field => async (parent, _args, context) => {
    const { id } = parent;
    const { dataloader } = context;
    const state = await dataloader.geography.states.load(id);

    return state[field];
  },
);

export default stateResolver;
