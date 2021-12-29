import { OutputFilter, ListResponse, BadRequestError } from '@via-profit-services/core';
import type {
  City,
  State,
  Country,
  GeographyServiceProps,
  CountriesTableRecord,
  CountriesTableRecordResult,
  StatesTableRecord,
  StatesTableRecordResult,
  CitiesTableRecord,
  CitiesTableRecordResult,
  AddressLookupQueryFields,
  GeographyServiceInterface,
  AddressLookupQueryResolve,
  CitiesOutputFilter,
} from '@via-profit-services/geography';
import {
  convertOrderByToKnex,
  convertWhereToKnex,
  convertSearchToKnex,
  extractTotalCountPropOfNode,
} from '@via-profit-services/knex';

class GeographyService implements GeographyServiceInterface {
  public props: GeographyServiceProps;
  public constructor(props: GeographyServiceProps) {
    this.props = props;
  }

  public async getCities(filter: Partial<CitiesOutputFilter>): Promise<ListResponse<City>> {
    const { context } = this.props;
    const { knex } = context;
    const { limit, offset, orderBy, where, search, priorCountry } = filter;
    const createdAt = new Date();

    const select = [knex.raw('*'), knex.raw('count(*) over() as "totalCount"')];
    let order = orderBy;

    if (priorCountry) {
      order = [{ field: 'priority', direction: 'desc' }, ...orderBy];
      select.push(knex.raw('"countryCode" = ? as "priority"', priorCountry));
    }

    if (search) {
      const citySearchIndex = search.findIndex(({ field }) => field === 'ru');
      if (citySearchIndex !== -1 && search[citySearchIndex].query[0]) {
        search[citySearchIndex].query =
          search[citySearchIndex].query[0].toUpperCase() + search[citySearchIndex].query.slice(1);
      }
    }

    const response = await knex
      .select(select)
      .from<CitiesTableRecord, CitiesTableRecordResult[]>('geographyCities')
      .limit(limit || 1)
      .offset(offset || 0)
      .where(builder => convertWhereToKnex(builder, where))
      .where(builder => convertSearchToKnex(builder, search, {}, { strategy: 'from-start' }))
      .orderBy(convertOrderByToKnex(order))
      .then(nodes =>
        nodes.map(node => ({
          ...node,
          country: {
            id: node.country,
          },
          state: {
            id: node.state,
          },
          createdAt,
          updatedAt: createdAt,
        })),
      )
      .then(nodes => ({
        ...extractTotalCountPropOfNode(nodes),
        offset,
        limit,
        orderBy,
        where,
      }));

    return response;
  }

  public async getCitiesByIds(ids: readonly string[]): Promise<City[]> {
    const { nodes } = await this.getCities({
      where: [['id', 'in', ids]],
      offset: 0,
      limit: ids.length,
    });

    return nodes;
  }

  public async getCity(id: string): Promise<City | false> {
    const nodes = await this.getCitiesByIds([id]);

    return nodes.length ? nodes[0] : false;
  }

  public async getStates(filter: Partial<OutputFilter>): Promise<ListResponse<State>> {
    const { context } = this.props;
    const { knex } = context;
    const { limit, offset, orderBy, where, search } = filter;
    const createdAt = new Date();

    const response = await knex
      .select([knex.raw('*'), knex.raw('count(*) over() as "totalCount"')])
      .from<StatesTableRecord, StatesTableRecordResult[]>('geographyStates')
      .limit(limit || 1)
      .offset(offset || 0)
      .where(builder => convertWhereToKnex(builder, where))
      .where(builder =>
        convertSearchToKnex(builder, search, {}, { strategy: 'blurry', splitWords: true }),
      )
      .orderBy(convertOrderByToKnex(orderBy))
      .then(nodes =>
        nodes.map(node => ({
          ...node,
          country: {
            id: node.country,
          },
          createdAt,
          updatedAt: createdAt,
        })),
      )
      .then(nodes => ({
        ...extractTotalCountPropOfNode(nodes),
        offset,
        limit,
        orderBy,
        where,
      }));

    return response;
  }

  public async getSatatesByIds(ids: readonly string[]): Promise<State[]> {
    const { nodes } = await this.getStates({
      where: [['id', 'in', ids]],
      offset: 0,
      limit: ids.length,
    });

    return nodes;
  }

  public async getState(id: string): Promise<State | false> {
    const nodes = await this.getSatatesByIds([id]);

    return nodes.length ? nodes[0] : false;
  }

  public async getCountries(filter: Partial<OutputFilter>): Promise<ListResponse<Country>> {
    const { context } = this.props;
    const { knex } = context;
    const { limit, offset, orderBy, where, search } = filter;
    const createdAt = new Date();

    const response = await knex
      .select([knex.raw('*'), knex.raw('count(*) over() as "totalCount"')])
      .from<CountriesTableRecord, CountriesTableRecordResult[]>('geographyCountries')
      .limit(limit || 1)
      .offset(offset || 0)
      .where(builder => convertWhereToKnex(builder, where))
      .where(builder => convertSearchToKnex(builder, search))
      .orderBy(convertOrderByToKnex(orderBy))
      .then(nodes =>
        nodes.map(node => ({
          ...node,
          capital: {
            id: node.capital,
          },
          createdAt,
          updatedAt: createdAt,
        })),
      )
      .then(nodes => ({
        ...extractTotalCountPropOfNode(nodes),
        offset,
        limit,
        orderBy,
        where,
      }));

    return response;
  }

  public async getCountriesByIds(ids: readonly string[]): Promise<Country[]> {
    const { nodes } = await this.getCountries({
      where: [['id', 'in', ids]],
      offset: 0,
      limit: ids.length,
    });

    return nodes;
  }

  public async getCountry(id: string): Promise<Country | false> {
    const nodes = await this.getCountriesByIds([id]);

    return nodes.length ? nodes[0] : false;
  }

  public async addressLookup(
    fields: Partial<AddressLookupQueryFields>,
  ): Promise<AddressLookupQueryResolve[]> {
    const { geocoder } = this.props;

    if (geocoder === null) {
      throw new BadRequestError('You must provide a Geocoder provider configuration');
    }

    return await geocoder.addressLookup(fields);
  }
}

export default GeographyService;
