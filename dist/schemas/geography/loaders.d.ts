import { DataLoader } from '@via-profit-services/core';
import { Context, ICity, IState, ICountry } from './types';
interface Loaders {
    cities: DataLoader<string, ICity>;
    states: DataLoader<string, IState>;
    countries: DataLoader<string, ICountry>;
}
export default function createLoaders(context: Context): Loaders;
export {};
