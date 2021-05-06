declare module '@via-profit-services/geography' {
  import { Context, OutputFilter, ListResponse, Middleware, InputFilter } from '@via-profit-services/core';
  import { GraphQLFieldResolver } from 'graphql';

  export type Resolvers = {
    Query: {
      geography: GraphQLFieldResolver<unknown, Context>;
    };
    GeographyQuery: {
      cities: GraphQLFieldResolver<unknown, Context, InputFilter>;
      countries: GraphQLFieldResolver<unknown, Context, InputFilter>;
      states: GraphQLFieldResolver<unknown, Context, InputFilter>;
      city: GraphQLFieldResolver<{ id?: string }, Context, { id?: string }>;
      country: GraphQLFieldResolver<{ id?: string }, Context, { id?: string }>;
      state: GraphQLFieldResolver<{ id?: string }, Context, { id?: string }>;
      addressLookup: GraphQLFieldResolver<unknown, Context, {
        query?: string;
        country?: string;
        city?: string;
        street?: string;
        state?: string;
        houseNumber?: string;
      }>;
    };
    City: CityResolver;
    Country: CountryResolver;
    State: StateResolver;
  };

  export type CityResolver = Record<keyof City, GraphQLFieldResolver<{ id: string}, Context>>;
  export type CountryResolver = Record<keyof Country, GraphQLFieldResolver<{ id: string}, Context>>;
  export type StateResolver = Record<keyof State, GraphQLFieldResolver<{ id: string}, Context>>;


  export interface GeographyServiceProps {
    context: Context;
    geocoder: geocoder | null;
  }

  export type Configuration =
  | YandexLookupProviderConfig
  | NominatimLookupProviderConfig
  | DaDataLookupProviderConfig
  | {};

  export type GeographyMiddlewareFactory = (config?: Configuration) => Middleware;

  export interface Country {
    id: string;
    en: string;
    ru: string;
    iso3: string;
    iso2: string;
    phoneCode: string;
    currency: string;
    capital: {
      id: string;
    } | null;
  }

  export interface State {
    id: string;
    en: string;
    ru: string;
    country: {
      id: string;
    };
    countryCode: string;
    stateCode: string;
  }


  export interface City {
    id: string;
    en: string;
    ru: string;
    country: {
      id: string;
    };
    countryCode: string;
    state: {
      id: string;
    };
    stateCode: string;
    latitude: string;
    longitude: string;
    timezone: string;
  }


  export type CitiesTableRecord = {
    readonly id: string;
    readonly ru: string;
    readonly en: string;
    readonly country: string;
    readonly countryCode: string;
    readonly state: string;
    readonly stateCode: string;
    readonly latitude: string;
    readonly longitude: string;
    readonly timezone: string;
  }

  export type CountriesTableRecord = {
    readonly id: string;
    readonly ru: string;
    readonly en: string;
    readonly iso3: string;
    readonly iso2: string;
    readonly phoneCode: string;
    readonly currency: string;
    readonly capital: string | null;
  }

  export type StatesTableRecord = {
    readonly id: string;
    readonly ru: string;
    readonly en: string;
    readonly country: string;
    readonly stateCode: string;
    readonly countryCode: string;
  }

  export type CitiesTableRecordResult = CitiesTableRecord & {
    readonly totalCount: number;
  };
  export type CountriesTableRecordResult = CountriesTableRecord & {
    readonly totalCount: number;
  };
  export type StatesTableRecordResult = StatesTableRecord & {
    readonly totalCount: number;
  };



  export interface GeographyServiceInterface {
    getCities(filter: Partial<OutputFilter>): Promise<ListResponse<City>>;
    getCitiesByIds(ids: string[]): Promise<City[]>;
    getCity(id: string): Promise<City | false>;
    getStates(filter: Partial<OutputFilter>): Promise<ListResponse<State>>;
    getSatatesByIds(ids: string[]): Promise<State[]>;
    getState(id: string): Promise<State | false>;
    getCountries(filter: Partial<OutputFilter>): Promise<ListResponse<Country>>;
    getCountriesByIds(ids: string[]): Promise<Country[]>;
    getCountry(id: string): Promise<Country | false>;
    addressLookup(
      fields: Partial<AddressLookupQueryFields>,
    ): Promise<AddressLookupQueryResolve[]>;
  }

  interface GeographyService extends GeographyServiceInterface {}
  class GeographyService {}

  export type geocoderProps = {
    context: Context;
  }

  interface geocoder {
    addressLookup(
      fields: Partial<AddressLookupQueryFields>,
    ): Promise<AddressLookupQueryResolve[]>;
  }


  export type AddressLookupQueryFields = {
    lang: 'ru' | 'en';
    query: string;
    country: string;
    street: string;
    state: string;
    houseNumber: string;
    city: string;
  }

  export type AddressLookupQueryResolve = {
    country: string;
    countryCode: string;
    street: string;
    state: string;
    houseNumber: string;
    city: string;
    latitude: string;
    longitude: string;
    place: string;
  }

  export type YandexResponseYGKind =
    | 'house'
    | 'street'
    | 'metro'
    | 'district'
    | 'locality'
    | 'area'
    | 'province'
    | 'country'
    | 'region'
    | 'hydro'
    | 'railway_station'
    | 'station'
    | 'route'
    | 'vegetation'
    | 'airport'
    | 'entrance'
    | 'other';

  export type YandexResponseYGPrecision =
    | 'exact'
    | 'number'
    | 'near'
    | 'range'
    | 'street'
    | 'other';

  export type NominatimLookupProviderConfig = {
    geocoder: 'Nominatim';
  }

  export type YandexLookupProviderConfig = {
    geocoder: 'Yandex';
    yandexGeocoderAPIKey: string;
  }

  export type DaDataLookupProviderConfig = {
    geocoder: 'DaData';
    daDataAPIKey: string;
  }


  export type YandexLookupProviderProps = geocoderProps & YandexLookupProviderConfig;
  export type DaDataLookupProviderProps = geocoderProps & DaDataLookupProviderConfig;

  export type DaDataResponseError = {
    family: 'CLIENT_ERROR';
    reason: string;
    message: string;
  };

  export type DaDataResponse = {
    suggestions: Array<{
      value: string;
      unrestricted_value: string;
      data: {
        postal_code: string | null;
        country: string | null;
        country_iso_code: string | null;
        federal_district: string | null;
        region_fias_id: string | null;
        region_kladr_id: string | null;
        region_iso_code: string | null;
        region_with_type: string | null;
        region_type: string | null;
        region_type_full: string | null;
        region: string | null;
        area_fias_id: string | null;
        area_kladr_id: string | null;
        area_with_type: string | null;
        area_type: string | null;
        area_type_full: string | null;
        area: string | null;
        city_fias_id: string | null;
        city_kladr_id: string | null;
        city_with_type: string | null;
        city_type: string | null;
        city_type_full: string | null;
        city: string | null;
        city_area: string | null;
        city_district_fias_id: string | null;
        city_district_kladr_id: string | null;
        city_district_with_type: string | null;
        city_district_type: string | null;
        city_district_type_full: string | null;
        city_district: string | null;
        settlement_fias_id: string | null;
        settlement_kladr_id: string | null;
        settlement_with_type: string | null;
        settlement_type: string | null;
        settlement_type_full: string | null;
        settlement: string | null;
        street_fias_id: string | null;
        street_kladr_id: string | null;
        street_with_type: string | null;
        street_type: string | null;
        street_type_full: string | null;
        street: string | null;
        house_fias_id: string | null;
        house_kladr_id: string | null;
        house_type: string | null;
        house_type_full: string | null;
        house: string | null;
        block_type: string | null;
        block_type_full: string | null;
        block: string | null;
        entrance: string | null;
        floor: string | null;
        flat_fias_id: string | null;
        flat_type: string | null;
        flat_type_full: string | null;
        flat: string | null;
        flat_area: string | null;
        square_meter_price: string | null;
        flat_price: string | null;
        postal_box: string | null;
        fias_id: string | null;
        fias_code: string | null;
        fias_level: string | null;
        fias_actuality_state: string | null;
        kladr_id: string | null;
        geoname_id: string | null;
        capital_marker: string | null;
        okato: string | null;
        oktmo: string | null;
        tax_office: string | null;
        tax_office_legal: string | null;
        timezone: string | null;
        geo_lat: string | null;
        geo_lon: string | null;
        beltway_hit: string | null;
        beltway_distance: string | null;
        metro: string | null;
        qc_geo: string | null;
        qc_complete: string | null;
        qc_house: string | null;
        history_values: string | null;
        unparsed_parts: string | null;
        source: string | null;
        qc: string | null;      
      };
    }>;
  }

  export type YandexResponseError = {
    statusCode: number;
    error: string;
    message: string;
  }

  export type YandexResponse = {
    response: {
      GeoObjectCollection: {
        metaDataProperty: {
          GeocoderResponseMetaData: {
            request: string;
            results: string;
            found: string;
          };
        };
            
        featureMember: Array<{
          GeoObject: {
            metaDataProperty: {
              GeocoderMetaData: {
                precision: YandexResponseYGPrecision;
                text: string;
                kind: YandexResponseYGKind;
                Address: {
                  country_code: string;
                  formatted: string;
                  postal_code: string;
                  Components: Array<{
                    kind: YandexResponseYGKind;
                    name: string;
                  }>;
                };
                /**
                 * @deprecated The field should not be used\
                 * The `AddressDetails` element is deprecated. The `Address` element is used instead.\
                 * It displays the full address of the object in hierarchical order\
                 * (country, region, city, district, street, house, building).
                 */
                AddressDetails: Record<string, any>;
              };
            };
            name: string;
            description: string;
            boundedBy: {
              Envelope: {
                lowerCorner: string;
                upperCorner: string;
              };
            };
            Point: {
              pos: string;
            };
          };
        }>;
      };
    };
  }

  export type NominatimResponse = Array<{
    place_id?: number;
    licence?: string;
    osm_type?: string;
    osm_id?: number;
    boundingbox?: string[];
    lat?: string;
    lon?: string;
    display_name?: string;
    class?: string;
    type?: string;
    importance?: string;
    address?: {
      building?: string;
      house_number?: string;
      road?: string;
      quarter?: string;
      city_district?: string;
      city?: string;
      county?: string;
      state?: string;
      region?: string;
      postcode?: string;
      country?: string;
      country_code?: string;
    };
  }>;

  export const typeDefs: string;
  export const resolvers: Resolvers;
  export const factory: GeographyMiddlewareFactory;
}

declare module '@via-profit-services/core' {
  import DataLoader from 'dataloader';
  import { Country, State, City, GeographyService } from '@via-profit-services/geography';

  interface DataLoaderCollection {
    geography: {
      countries: DataLoader<string, Node<Country>>;
      states: DataLoader<string,  Node<State>>;
      cities: DataLoader<string,  Node<City>>;
    }
  }

  interface ServicesCollection {
    geography: GeographyService;
  }
}

