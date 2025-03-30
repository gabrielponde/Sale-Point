import { Product } from '../../models/Product';
import { IProductResponse } from '../IProductResponse';
import { IProductFormatter } from '../IProductFormatter';

export class ProductFormatterImpl implements IProductFormatter {
    formatProduct(product: Product, categoryId: number): IProductResponse {
        return {
            id: product.id,
            description: product.description,
            quantity_stock: product.quantity_stock.toString(),
            value: parseFloat(product.value).toFixed(2),
            category_id: categoryId,
            image_url: product.image_url 
        };
    }
}
