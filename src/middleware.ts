import { Middleware } from '@via-profit-services/core';
import { GeographyMiddlewareFactory } from '@via-profit-services/geography';
import type {
  YandexLookupProviderConfig,
  NominatimLookupProviderConfig,
  DaDataLookupProviderConfig,
  geocoder,
} from '@via-profit-services/geography';
import DataLoader from '@via-profit-services/dataloader';

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

const geographyFactory: GeographyMiddlewareFactory = config => {
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
      cities: new DataLoader(async ids => context.services.geography.getCitiesByIds(ids), {
        redis: context.redis,
        defaultExpiration: '1h',
        cacheName: 'geography:cities',
      }),

      // States dataloader
      states: new DataLoader((ids: string[]) => context.services.geography.getSatatesByIds(ids), {
        redis: context.redis,
        defaultExpiration: '1h',
        cacheName: 'geography:states',
      }),

      // Countries dataloader
      countries: new DataLoader(
        (ids: string[]) => context.services.geography.getCountriesByIds(ids),
        {
          redis: context.redis,
          defaultExpiration: '1h',
          cacheName: 'geography:countries',
        },
      ),
    };

    return {
      context,
    };
  };

  return middleware;
};

export default geographyFactory;
