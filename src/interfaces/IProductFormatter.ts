import { Product } from '../models/Product';
import { IProductResponse } from './IProductResponse';

export interface IProductFormatter {
    formatProduct(product: Product, categoryId: number): IProductResponse;
}
