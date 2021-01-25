import { Middleware, collateForDataloader, Node } from '@via-profit-services/core';
import { GeographyMiddlewareFactory } from '@via-profit-services/geography';
import type { City, State, Country } from '@via-profit-services/geography';
import DataLoader from 'dataloader';

import GeographyService from './GeographyService';

const pool: ReturnType<Middleware> = {
  context: null,
};

const geographyFactory: GeographyMiddlewareFactory = () => {

  const middleware: Middleware = ({ context }) => {

    if (pool.context !== null) {
      return pool;
    }

    // Declare initial context state
    pool.context = context;

    // Geography Service
    const service = new GeographyService({ context });
    pool.context.services.geography = service;

    pool.context.dataloader.geography = {
      // Cities dataloader
      cities: new DataLoader((ids: string[]) => service.getCitiesByIds(ids)
        .then((nodes) => collateForDataloader(ids, nodes as Node<City>[]))),

      // States dataloader
      states: new DataLoader((ids: string[]) => service.getSatatesByIds(ids)
        .then((nodes) => collateForDataloader(ids, nodes as Node<State>[]))),

      // Countries dataloader
      countries: new DataLoader((ids: string[]) => service.getCountriesByIds(ids)
        .then((nodes) => collateForDataloader(ids, nodes as Node<Country>[]))),
    };

    return pool;
  }

  return middleware
};

export default geographyFactory;
