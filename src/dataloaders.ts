import { DataLoaderCollection, collateForDataloader, Node, Context } from '@via-profit-services/core';
import { Country, State, City } from '@via-profit-services/geography';
import DataLoader from 'dataloader';

import GeographyService from './GeographyService';


const dataloader: Pick<DataLoaderCollection, 'geography'> = {
  geography: {
    countries: null,
    states: null,
    cities: null,
  },
};

export default (context: Context): Pick<DataLoaderCollection, 'geography'> => {

  if (dataloader.geography.cities !== null) {
    return dataloader;
  }

  const service = new GeographyService({ context });

  // cities loader
  dataloader.geography.cities = new DataLoader((ids: string[]) => service.getCitiesByIds(ids)
      .then((nodes) => collateForDataloader(ids, nodes as Node<City>[])));

  // states loader
  dataloader.geography.states = new DataLoader((ids: string[]) => service.getSatatesByIds(ids)
      .then((nodes) => collateForDataloader(ids, nodes as Node<State>[])));

  // countries loader
  dataloader.geography.countries = new DataLoader((ids: string[]) => service.getCountriesByIds(ids)
      .then((nodes) => collateForDataloader(ids, nodes as Node<Country>[])));

  return dataloader;
}
