import { performance } from 'perf_hooks';
import https, { RequestOptions } from 'https';
import { IncomingMessage } from 'http';
import { BadRequestError } from '@via-profit-services/core';
import {
  geocoder, AddressLookupQueryFields, DaDataResponseError,
  AddressLookupQueryResolve, DaDataResponse, DaDataLookupProviderProps,
} from '@via-profit-services/geography';

class DaDataProvider implements geocoder {
  private props: DaDataLookupProviderProps;

  public constructor(props: DaDataLookupProviderProps) {
    this.props = props;
  }


  private isResponseError(payload: any): payload is DaDataResponseError {
    return typeof payload?.family === 'string'
      && typeof payload?.message === 'string'
      && typeof payload?.reason === 'string';
  }

  private isResponseSuccess(payload: any): payload is DaDataResponse {
    return typeof payload?.suggestions !== 'undefined';
  }

  public async addressLookup(
    fields: Partial<AddressLookupQueryFields>,
  ): Promise<AddressLookupQueryResolve[]> {
    return new Promise((resolve, reject) => {
      const { context, daDataAPIKey } = this.props;
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

      const bodyParams = {
        query: queryStr,
        count: 10,
        language: lang,
      };

      const requestParams: RequestOptions = {
        host: 'suggestions.dadata.ru',
        path: '/suggestions/api/4_1/rs/suggest/address',
        protocol: 'https:',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'openid-client',
          'Content-Type': 'application/json',
          Authorization: `Token ${daDataAPIKey}`,
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
            const data: DaDataResponse | DaDataResponseError = JSON.parse(body);
            const queryTime = performance.now() - startTime;
            logger.server.debug(`[${queryTime.toFixed(3)} ms] DaData request to address lookup. Query: «${queryStr}»`);


            if (!this.isResponseSuccess(data)) {
              if (this.isResponseError(data)) {
                throw new BadRequestError(
                  `DaData request to address lookup error. «${data.message}»`,
                );
              }

              throw new BadRequestError(
                'DaData request to address lookup error. «Unknown message»',
              );
            }

            const result: AddressLookupQueryResolve[] = data.suggestions
            .map(({ data, value }) => ({
              countryCode: data?.country_iso_code || '',
              country: data?.country || '',
              city: data?.city || '',
              state: (`${data?.region} ${data?.region_type_full}`).trim() || '',
              street: data?.street || '',
              houseNumber: data?.house || '',
              place: value,
              latitude: data?.geo_lat || '',
              longitude: data?.geo_lon || '',
            }));

            resolve(result);
          } catch (err) {
            console.error(err);
            reject(err);
          }
        });
      }

      const request = https.request(requestParams, requestCallback);
      request.write(JSON.stringify(bodyParams));
      request.end();
    });
  }
}

export default DaDataProvider;