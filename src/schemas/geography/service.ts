import {
  TOutputFilter,
  convertOrderByToKnex,
  convertWhereToKnex,
  TWhereAction,
  IListResponse,
} from '@via-profit-services/core';

import {
  Context, ICity, IState, ICountry, ICityPlaneInput, IStatePlaneInput, ICountryPlaneInput,
} from './types';

interface IProps {
  context: Context;
}

class Geography {
  public props: IProps;

  public constructor(props: IProps) {
    this.props = props;
  }

  public async getCities(filter: Partial<TOutputFilter>): Promise<IListResponse<ICity>> {
    const { context } = this.props;
    const { knex } = context;
    const {
      limit, offset, orderBy, where, search,
    } = filter;
    const createdAt = new Date();

    const dbResponse = await knex
      .select([
        knex.raw('*'),
        knex.raw('count(*) over() as "totalCount"'),
      ])
      .from<any, Array<ICityPlaneInput & {totalCount: number}>>('geographyCities')
      .limit(limit || 1)
      .offset(offset || 0)
      .where((builder) => convertWhereToKnex(builder, where))
      .where((builder) => {
        // This is a temporary solution until the «Search» module is implemented
        if (search) {
          search.forEach(({ field, query }) => {
            query.split(' ').map((subquery) => {
              // Note: Set type ::text forcibly
              return builder.orWhereRaw(`"${field}"::text ${TWhereAction.ILIKE} '%${subquery}%'`);
            });
          });
        }
        return builder;
      })
      .orderBy(convertOrderByToKnex(orderBy))
      .then(async (nodes) => {
        return {
          totalCount: nodes.length ? Number(nodes[0].totalCount) : 0,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          nodes: nodes.map(({ totalCount, ...nodeData }) => {
            return {
              ...nodeData,
              country: {
                id: nodeData.country,
              },
              state: {
                id: nodeData.state,
              },
              createdAt,
              updatedAt: createdAt,
            };
          }),
        };
      });


    const { totalCount, nodes } = dbResponse;

    return {
      totalCount,
      nodes,
      where,
      orderBy,
      limit,
      offset,
    };
  }

  public async getCitiesByIds(ids: string[]): Promise<ICity[]> {
    const { nodes } = await this.getCities({
      where: [['id', TWhereAction.IN, ids]],
      offset: 0,
      limit: ids.length,
    });

    return nodes;
  }

  public async getCity(id: string): Promise<ICity | false> {
    const nodes = await this.getCitiesByIds([id]);
    return nodes.length ? nodes[0] : false;
  }

  public async getStates(filter: Partial<TOutputFilter>): Promise<IListResponse<IState>> {
    const { context } = this.props;
    const { knex } = context;
    const {
      limit, offset, orderBy, where, search,
    } = filter;
    const createdAt = new Date();

    const dbResponse = await knex
      .select([
        knex.raw('*'),
        knex.raw('count(*) over() as "totalCount"'),
      ])
      .from<any, Array<IStatePlaneInput & {totalCount: number}>>('geographyStates')
      .limit(limit || 1)
      .offset(offset || 0)
      .where((builder) => convertWhereToKnex(builder, where))
      .where((builder) => {
        // This is a temporary solution until the «Search» module is implemented
        if (search) {
          search.forEach(({ field, query }) => {
            query.split(' ').map((subquery) => {
              // Note: Set type ::text forcibly
              return builder.orWhereRaw(`"${field}"::text ${TWhereAction.ILIKE} '%${subquery}%'`);
            });
          });
        }
        return builder;
      })
      .orderBy(convertOrderByToKnex(orderBy))
      .then(async (nodes) => {
        return {
          totalCount: nodes.length ? Number(nodes[0].totalCount) : 0,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          nodes: nodes.map(({ totalCount, ...nodeData }) => {
            return {
              ...nodeData,
              country: {
                id: nodeData.country,
              },
              createdAt,
              updatedAt: createdAt,
            };
          }),
        };
      });


    const { totalCount, nodes } = dbResponse;

    return {
      totalCount,
      nodes,
      where,
      orderBy,
      limit,
      offset,
    };
  }

  public async getSatatesByIds(ids: string[]): Promise<IState[]> {
    const { nodes } = await this.getStates({
      where: [['id', TWhereAction.IN, ids]],
      offset: 0,
      limit: ids.length,
    });

    return nodes;
  }

  public async getState(id: string): Promise<IState | false> {
    const nodes = await this.getSatatesByIds([id]);
    return nodes.length ? nodes[0] : false;
  }

  public async getCountries(filter: Partial<TOutputFilter>): Promise<IListResponse<ICountry>> {
    const { context } = this.props;
    const { knex } = context;
    const {
      limit, offset, orderBy, where, search,
    } = filter;
    const createdAt = new Date();

    const dbResponse = await knex
      .select([
        knex.raw('*'),
        knex.raw('count(*) over() as "totalCount"'),
      ])
      .from<any, Array<ICountryPlaneInput & {totalCount: number}>>('geographyCountries')
      .limit(limit || 1)
      .offset(offset || 0)
      .where((builder) => convertWhereToKnex(builder, where))
      .where((builder) => {
        // This is a temporary solution until the «Search» module is implemented
        if (search) {
          search.forEach(({ field, query }) => {
            query.split(' ').map((subquery) => {
              // Note: Set type ::text forcibly
              return builder.orWhereRaw(`"${field}"::text ${TWhereAction.ILIKE} '%${subquery}%'`);
            });
          });
        }
        return builder;
      })
      .orderBy(convertOrderByToKnex(orderBy))
      .then(async (nodes) => {
        return {
          totalCount: nodes.length ? Number(nodes[0].totalCount) : 0,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          nodes: nodes.map(({ totalCount, ...nodeData }) => {
            return {
              ...nodeData,
              capital: nodeData.capital ? {
                id: nodeData.capital,
              } : null,
              createdAt,
              updatedAt: createdAt,
            };
          }),
        };
      });


    const { totalCount, nodes } = dbResponse;

    return {
      totalCount,
      nodes,
      where,
      orderBy,
      limit,
      offset,
    };
  }

  public async getCountriesByIds(ids: string[]): Promise<ICountry[]> {
    const { nodes } = await this.getCountries({
      where: [['id', TWhereAction.IN, ids]],
      offset: 0,
      limit: ids.length,
    });

    return nodes;
  }

  public async getCountry(id: string): Promise<ICountry | false> {
    const nodes = await this.getCountriesByIds([id]);
    return nodes.length ? nodes[0] : false;
  }
}


export default Geography;
export { Geography };
