import { Resolvers } from '@via-profit-services/geography';
import { buildQueryFilter, buildCursorConnection, ServerError } from '@via-profit-services/core';


const GeographyQuery: Resolvers['GeographyQuery'] = {
  cities: async (_parent, args, context) => {
    const { services } = context;
    const filter = buildQueryFilter(args);

    try {
      const citiesConnection = await services.geography.getCities(filter);
      const connection = buildCursorConnection(citiesConnection, 'cities');

      return connection;

    } catch (err) {
      throw new ServerError('Failed to get Cities list', { err });
    }
  },
  states: async (_parent, args, context) => {
    const { services } = context;
    const filter = buildQueryFilter(args);

    try {
      const citiesConnection = await services.geography.getStates(filter);
      const connection = buildCursorConnection(citiesConnection, 'states');

      return connection;

    } catch (err) {
      throw new ServerError('Failed to get States list', { err });
    }
  },
  countries: async (_parent, args, context) => {
    const { services } = context;
    const filter = buildQueryFilter(args);

    try {
      const citiesConnection = await services.geography.getCountries(filter);
      const connection = buildCursorConnection(citiesConnection, 'countries');

      return connection;

    } catch (err) {
      throw new ServerError('Failed to get Countries list', { err });
    }
  },
  city: async (parent, args, context) => {
    const { dataloader } = context;
    const city = await dataloader.geography.cities.load(parent?.id || args?.id);

    return city || null;
  },
  country: async (parent, args, context) => {
    const { dataloader } = context;
    const country = await dataloader.geography.countries.load(parent?.id || args?.id);

    return country || null;
  },
  state: async (parent, args, context) => {
    const { dataloader } = context;
    const state = await dataloader.geography.states.load(parent?.id || args?.id);

    return state || null;
  },
  addressLookup: async (_parent, args, context) => {
    const { services } = context;

    const result = await services.geography.addressLookup(args);
    const countryCodes = result.map((field) => field.countryCode.toUpperCase());
    const cities = await services.geography.getCities({
      where: [['countryCode', 'in', countryCodes]],
      limit: Number.MAX_SAFE_INTEGER,
    });

    return result.map((field) => {
      const city = cities.nodes.find(({ ru, countryCode }) => (
        field.countryCode?.toUpperCase() === countryCode
        && field.city?.toLowerCase() === ru.toLowerCase()
      ));

      return {
        ...field,
        city: city || null,
      }
    });
  },
};

export default GeographyQuery;
