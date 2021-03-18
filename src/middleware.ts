import { Middleware, collateForDataloader, Node } from '@via-profit-services/core';
import { GeographyMiddlewareFactory } from '@via-profit-services/geography';
import type { City, State, Country } from '@via-profit-services/geography';
import DataLoader from 'dataloader';

import GeographyService from './GeographyService';

const geographyFactory: GeographyMiddlewareFactory = () => {
  const middleware: Middleware = ({ context }) => {

    // Geography Service
    context.services.geography = context.services.geography ?? new GeographyService({ context });

    context.dataloader.geography = context.dataloader.geography ?? {
      // Cities dataloader
      cities: new DataLoader((ids: string[]) => context.services.geography.getCitiesByIds(ids)
        .then((nodes) => collateForDataloader(ids, nodes as Node<City>[]))),

      // States dataloader
      states: new DataLoader((ids: string[]) => context.services.geography.getSatatesByIds(ids)
        .then((nodes) => collateForDataloader(ids, nodes as Node<State>[]))),

      // Countries dataloader
      countries: new DataLoader((ids: string[]) => context.services.geography.getCountriesByIds(ids)
        .then((nodes) => collateForDataloader(ids, nodes as Node<Country>[]))),
    };

    return {
      context,
    };
  }

  return middleware
};

export default geographyFactory;
