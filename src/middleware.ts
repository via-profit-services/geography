import { Middleware, collateForDataloader, Node } from '@via-profit-services/core';
import { GeographyMiddlewareFactory } from '@via-profit-services/geography';
import type {
  City, State, Country, YandexLookupProviderConfig, NominatimLookupProviderConfig,
  DaDataLookupProviderConfig, geocoder,
} from '@via-profit-services/geography';
import DataLoader from 'dataloader';

import GeographyService from './services/GeographyService';
import NominatimProvider from './services/NominatimProvider';
import YandexProvider from './services/YandexProvider';
import DaDataProvider from './services/DaDataProvider';


const isProviderYandex = (config: any): config is YandexLookupProviderConfig =>
  config?.geocoder === 'Yandex' && typeof config?.yandexGeocoderAPIKey === 'string';

const isProviderNominatim = (config: any): config is NominatimLookupProviderConfig =>
  config?.geocoder === 'Nominatim';

const isProviderDaData = (config: any): config is DaDataLookupProviderConfig =>
  config?.geocoder === 'DaData' && typeof config?.daDataAPIKey === 'string';


const geographyFactory: GeographyMiddlewareFactory = (config) => {
  const middleware: Middleware = ({ context }) => {

    let geocoder: geocoder | null = null;

    if (isProviderYandex(config)) {
      geocoder = new YandexProvider({
        ...config,
        context,
      });
    }

    if (isProviderDaData(config)) {
      geocoder = new DaDataProvider({
        ...config,
        context,
      });
    }

    if (isProviderNominatim(config) || geocoder === null) {
      geocoder = new NominatimProvider({
        ...config,
        context,
      });
    }


    // Geography Service
    context.services.geography = new GeographyService({
      context,
      geocoder,
    });

    context.dataloader.geography = {
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
