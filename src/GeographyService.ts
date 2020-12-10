import { OutputFilter, ListResponse } from '@via-profit-services/core';
import { City, State, Country, GeographyServiceProps } from '@via-profit-services/geography';
import {
  convertOrderByToKnex, convertWhereToKnex,
  convertSearchToKnex, extractTotalCountPropOfNode,
} from '@via-profit-services/knex';


type CitiesTableModel = {
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
  readonly totalCount: number;
}

type CountriesTableModel = {
  readonly id: string;
  readonly ru: string;
  readonly en: string;
  readonly iso3: string;
  readonly iso2: string;
  readonly phoneCode: string;
  readonly currency: string;
  readonly capital: string;
  readonly totalCount: number;
}

type StatesTableModel = {
  readonly id: string;
  readonly ru: string;
  readonly en: string;
  readonly country: string;
  readonly stateCode: string;
  readonly countryCode: string;
  readonly totalCount: number;
}

type CitiesTableModelResult = CitiesTableModel;
type CountriesTableModelResult = CountriesTableModel;
type StatesTableModelResult = StatesTableModel;


class GeographyService {
  public props: GeographyServiceProps;

  public constructor(props: GeographyServiceProps) {
    this.props = props;
  }

  public async getCities(filter: Partial<OutputFilter>): Promise<ListResponse<City>> {
    const { context } = this.props;
    const { knex } = context;
    const {
      limit, offset, orderBy, where, search,
    } = filter;
    const createdAt = new Date();

    const response = await knex
      .select([
        knex.raw('*'),
        knex.raw('count(*) over() as "totalCount"'),
      ])
      .from<CitiesTableModel, CitiesTableModelResult[]>('geographyCities')
      .limit(limit || 1)
      .offset(offset || 0)
      .where((builder) => convertWhereToKnex(builder, where))
      .where((builder) => convertSearchToKnex(builder, search))
      .orderBy(convertOrderByToKnex(orderBy))
      .then((nodes) => nodes.map((node) => ({
        ...node,
        country: {
          id: node.country,
        },
        state: {
          id: node.state,
        },
        createdAt,
        updatedAt: createdAt,
      })))
      .then((nodes) => ({
        ...extractTotalCountPropOfNode(nodes),
        offset,
        limit,
        orderBy,
        where,
      }));

    return response;
  }

  public async getCitiesByIds(ids: string[]): Promise<City[]> {
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
      .select([
        knex.raw('*'),
        knex.raw('count(*) over() as "totalCount"'),
      ])
      .from<StatesTableModel, StatesTableModelResult[]>('geographyStates')
      .limit(limit || 1)
      .offset(offset || 0)
      .where((builder) => convertWhereToKnex(builder, where))
      .where((builder) => convertSearchToKnex(builder, search))
      .orderBy(convertOrderByToKnex(orderBy))
      .then((nodes) => nodes.map((node) => ({
        ...node,
        country: {
          id: node.country,
        },
        createdAt,
        updatedAt: createdAt,
      })))
      .then((nodes) => ({
        ...extractTotalCountPropOfNode(nodes),
        offset,
        limit,
        orderBy,
        where,
      }));


    return response;
  }

  public async getSatatesByIds(ids: string[]): Promise<State[]> {
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
      .select([
        knex.raw('*'),
        knex.raw('count(*) over() as "totalCount"'),
      ])
      .from<CountriesTableModel, CountriesTableModelResult[]>('geographyCountries')
      .limit(limit || 1)
      .offset(offset || 0)
      .where((builder) => convertWhereToKnex(builder, where))
      .where((builder) => convertSearchToKnex(builder, search))
      .orderBy(convertOrderByToKnex(orderBy))
      .then((nodes) => nodes.map((node) => ({
        ...node,
        capital: {
          id: node.capital,
        },
        createdAt,
        updatedAt: createdAt,
      })))
      .then((nodes) => ({
        ...extractTotalCountPropOfNode(nodes),
        offset,
        limit,
        orderBy,
        where,
      }));

    return response;
  }

  public async getCountriesByIds(ids: string[]): Promise<Country[]> {
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
}


export default GeographyService;
