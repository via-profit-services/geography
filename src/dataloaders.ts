import { DataLoaderCollection, collateForDataloader, Node, Context } from '@via-profit-services/core';
import { Country, State, City } from '@via-profit-services/geography';
import DataLoader from 'dataloader';

import GeographyService from './GeographyService';


export default (context: Context): Pick<DataLoaderCollection, 'geography'> => {

  const service = new GeographyService({ context });

  // cities loader
  const cities = new DataLoader((ids: string[]) => service.getCitiesByIds(ids)
      .then((nodes) => collateForDataloader(ids, nodes as Node<City>[])));

  // states loader
  const states = new DataLoader((ids: string[]) => service.getSatatesByIds(ids)
      .then((nodes) => collateForDataloader(ids, nodes as Node<State>[])));

  // countries loader
  const countries = new DataLoader((ids: string[]) => service.getCountriesByIds(ids)
      .then((nodes) => collateForDataloader(ids, nodes as Node<Country>[])));

  return {
    geography: {
      countries,
      states,
      cities,
    },
  };
}
