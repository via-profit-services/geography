import { performance } from 'perf_hooks';
import https, { RequestOptions } from 'https';
import { IncomingMessage } from 'http';
import querystring from 'querystring';
import {
  geocoder, geocoderProps, AddressLookupQueryFields,
  NominatimResponse, AddressLookupQueryResolve,
} from '@via-profit-services/geography';

class NominatimProvider implements geocoder {
  private props: geocoderProps;

  public constructor(props: geocoderProps) {
    this.props = props;
  }
  public async addressLookup(
    fields: Partial<AddressLookupQueryFields>,
  ): Promise<AddressLookupQueryResolve[]> {
    return new Promise((resolve, reject) => {
      const { logger } = this.props.context;
      const { street, houseNumber, city, state, country, query } = fields;
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
        q: queryStr,
        format: 'json',
        polygon: 1,
        addressdetails: 1,
      });

      const requestParams: RequestOptions = {
        host: 'nominatim.openstreetmap.org',
        path: `/search?${querystringParams}`,
        protocol: 'https:',
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'openid-client',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };
      const startTime = performance.now();
      const requestCallback: (e: IncomingMessage) => void = (response) => {
        response.setEncoding('utf8');

        let body = '';
        response.on('data', (chunk) => {
          body += chunk.toString();
        })

        response.on('end', async () => {
          try {
            const data: NominatimResponse = JSON.parse(body);
            const queryTime = performance.now() - startTime;

            logger.server.debug(`[${queryTime.toFixed(3)} ms] OpenStreetMap request to address lookup. Query: «${queryStr}»`);
            const result: AddressLookupQueryResolve[] = data.map((field) => ({
              latitude: field?.lat || '',
              longitude: field?.lon || '',
              houseNumber: field?.address?.house_number || '',
              city: field?.address?.city || '',
              country: field?.address?.country || '',
              countryCode: String(field?.address?.country_code || '').toUpperCase(),
              state: field?.address?.state || '',
              street: field?.address?.road || '',
              place: field?.display_name || '',
            }));

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

export default NominatimProvider;