import { ApiError } from "../helpers/api-error";

export class Validator {
    static validateRegisterData(client_id: number, order_products: any[]): void {
        if (!client_id) throw new ApiError('O ID do cliente é obrigatório.', 400);
        if (!order_products || order_products.length === 0) {
            throw new ApiError('É necessário pelo menos um produto na ordem.', 400);
        }
    }
}