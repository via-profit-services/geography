import {
  DataLoader, collateForDataloader, Node,
} from '@via-profit-services/core';

import GeographyService from './service';
import {
  Context, ICity, IState, ICountry,
} from './types';

interface Loaders {
  cities: DataLoader<string, ICity>;
  states: DataLoader<string, IState>;
  countries: DataLoader<string, ICountry>;
}

const loaders: Loaders = {
  cities: null,
  states: null,
  countries: null,
};

export default function createLoaders(context: Context) {
  if (loaders.cities !== null) {
    return loaders;
  }

  const service = new GeographyService({ context });

  // cities loader
  loaders.cities = new DataLoader((ids: string[]) => {
    return service.getCitiesByIds(ids)
      .then((nodes) => collateForDataloader(ids, nodes as Node<ICity>[]));
  });

  // states loader
  loaders.states = new DataLoader((ids: string[]) => {
    return service.getSatatesByIds(ids)
      .then((nodes) => collateForDataloader(ids, nodes as Node<IState>[]));
  });

  // countries loader
  loaders.countries = new DataLoader((ids: string[]) => {
    return service.getCountriesByIds(ids)
      .then((nodes) => collateForDataloader(ids, nodes as Node<ICountry>[]));
  });

  return loaders;
}
