import { performance } from 'perf_hooks';
import https, { RequestOptions } from 'https';
import { IncomingMessage } from 'http';
import querystring from 'querystring';
import { BadRequestError } from '@via-profit-services/core';
import {
  geocoder, AddressLookupQueryFields, YandexResponseError,
  AddressLookupQueryResolve, YandexResponse, YandexLookupProviderProps,
} from '@via-profit-services/geography';

class YandexProvider implements geocoder {
  private props: YandexLookupProviderProps;

  public constructor(props: YandexLookupProviderProps) {
    this.props = props;
  }

  private resolveLang(lang: AddressLookupQueryFields['lang']): string {
    switch (lang) {
      case 'en':
        return 'en_US';

      case 'ru':
        default:
        return 'ru_RU';
    }
  }

  private isResponseError(payload: any): payload is YandexResponseError {
    return typeof payload?.error === 'string'
      && typeof payload?.message === 'string'
      && typeof payload?.statusCode === 'number';
  }

  private isResponseSuccess(payload: any): payload is YandexResponse {
    return typeof payload?.response !== 'undefined';
  }

  public async addressLookup(
    fields: Partial<AddressLookupQueryFields>,
  ): Promise<AddressLookupQueryResolve[]> {
    return new Promise((resolve, reject) => {
      const { context, yandexGeocoderAPIKey } = this.props;
      const { logger } = context;
      const { street, houseNumber, city, state, country, query, lang } = fields;
      const queryArray = [
        String(country || '').toLowerCase(),
        String(city || '').toLowerCase(),
        String(street || '').toLowerCase(),
        String(state || '').toLowerCase(),
        String(houseNumber || '').toLowerCase(),
      ];

      const queryStr = typeof query === 'string' ? query : queryArray
        .filter((elem) => elem !== '')
        .join(', ');

      const querystringParams = querystring.stringify({
        geocode: queryStr,
        apikey: yandexGeocoderAPIKey,
        lang: this.resolveLang(lang),
        results: 10,
        format: 'json',
      });

      const requestParams: RequestOptions = {
        host: 'geocode-maps.yandex.ru',
        path: `/1.x?${querystringParams}`,
        protocol: 'https:',
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-agent': 'openid-client',
          'Content-type': 'application/x-www-form-urlencoded',
        },
      };
      const startTime = performance.now();
      const requestCallback: (e: IncomingMessage) => void = (response) => {
        response.setEncoding('utf8');

        let body = '';
        response.on('data', (chunk) => {
          body += chunk.toString();
        })

        response.on('end', () => {
          try {
            const data: YandexResponse | YandexResponseError = JSON.parse(body);
            const queryTime = performance.now() - startTime;
            logger.server.debug(`[${queryTime.toFixed(3)} ms] Yandex request to address lookup. Query: «${queryStr}»`);


            if (!this.isResponseSuccess(data)) {
              if (this.isResponseError(data)) {
                throw new BadRequestError(
                  `Yandex request to address lookup error. «${data.message}»`,
                );
              }

              throw new BadRequestError(
                'Yandex request to address lookup error. «Unknown message»',
              );
            }

            const { featureMember } = data.response.GeoObjectCollection;
            const result: AddressLookupQueryResolve[] = featureMember.map(({ GeoObject }) => {
              const { Address } = GeoObject.metaDataProperty.GeocoderMetaData;
              const street = Address.Components.find(({ kind }) => kind === 'street')
              const country = Address.Components.find(({ kind }) => kind === 'country')
              const locality = Address.Components.find(({ kind }) => kind === 'locality')
              const province = Address.Components.reverse().find(({ kind }) => kind === 'province')
              const house = Address.Components.find(({ kind }) => kind === 'house')
              const { pos } = GeoObject.Point;
              const [ longitude, latitude] = pos.split(' ');

              return {
                countryCode: Address.country_code,
                city: locality?.name || '',
                country: country?.name || '',
                state: province?.name || '',
                street: street?.name || '',
                houseNumber: house?.name || '',
                place: Address.formatted,
                latitude,
                longitude,
              }
            });

            resolve(result);
          } catch (err) {
            console.error(err);
            reject(err);
          }
        });
      }

      const request = https.request(requestParams, requestCallback);
      request.end();
    });
  }
}

export default YandexProvider;