import { TOutputFilter, IListResponse } from '@via-profit-services/core';
import { Context, ICity, IState, ICountry } from './types';
interface IProps {
    context: Context;
}
declare class Geography {
    props: IProps;
    constructor(props: IProps);
    getCities(filter: Partial<TOutputFilter>): Promise<IListResponse<ICity>>;
    getCitiesByIds(ids: string[]): Promise<ICity[]>;
    getCity(id: string): Promise<ICity | false>;
    getStates(filter: Partial<TOutputFilter>): Promise<IListResponse<IState>>;
    getSatatesByIds(ids: string[]): Promise<IState[]>;
    getState(id: string): Promise<IState | false>;
    getCountries(filter: Partial<TOutputFilter>): Promise<IListResponse<ICountry>>;
    getCountriesByIds(ids: string[]): Promise<ICountry[]>;
    getCountry(id: string): Promise<ICountry | false>;
}
export default Geography;
export { Geography };
