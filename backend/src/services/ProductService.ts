import { Product } from '../models/Product';
import { OrderRepository } from '../repositories/ordersRepository';
import { ApiError } from '../helpers/api-error';

export class ProductService {
    private orderRepository: OrderRepository;

    constructor(orderRepository: OrderRepository) {
        this.orderRepository = orderRepository;
    }

    async validateAndFetchProducts(order_products: any[]): Promise<Product[]> {
        const productIds = order_products.map((p: any) => p.product_id);
        const products = await this.orderRepository.findProductById(productIds);

        if (!products || products.length === 0) {
            throw new ApiError('Nenhum produto encontrado para os IDs de produto fornecidos.', 404);
        }

        for (const orderProduct of order_products) {
            const product = products.find((p: Product) => p.id === orderProduct.product_id);
            if (!product) {
                throw new ApiError(`Produto com ID ${orderProduct.product_id} não encontrado.`, 404);
            }

            if (product.quantity_stock < orderProduct.quantity_product) {
                throw new ApiError(
                    `Estoque insuficiente para o produto ${product.description}. Disponível: ${product.quantity_stock}. Solicitado: ${orderProduct.quantity_product}.`, 400);
            }
        }

        return products;
    }
}
