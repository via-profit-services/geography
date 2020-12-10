import { IObjectTypeResolver } from '@graphql-tools/utils';
import { Context } from '@via-profit-services/core';

import CitiesListConnection from './CitiesListConnection';
import CountriesListConnection from './CountriesListConnection';
import StatesListConnection from './StatesListConnection';

interface Parent {
  id?: string
}

interface Args {
  id?: string
}

const GeographyQuery: IObjectTypeResolver<any, Context, any> = {
  cities: CitiesListConnection,
  states: StatesListConnection,
  countries: CountriesListConnection,
  city: async (parent: Parent, args: Args, context) => {
    const { dataloader } = context;
    const city = await dataloader.geography.cities.load(parent?.id || args?.id);

    return city || null;
  },
  country: async (parent: Parent, args: Args, context) => {
    const { dataloader } = context;
    const country = await dataloader.geography.countries.load(parent?.id || args?.id);

    return country || null;
  },
  state: async (parent: Parent, args: Args, context) => {
    const { dataloader } = context;
    const state = await dataloader.geography.states.load(parent?.id || args?.id);

    return state || null;
  },
};

export default GeographyQuery;
