import { AppDataSource } from '../config/data-source'; 
import { Product } from '../models/Product'; 
import { Repository } from 'typeorm';
import { ApiError } from '../helpers/api-error';
import { Category } from '../models/Category';
import { Order } from '../models/Order';

export class ProductRepository {
    private repository: Repository<Product>;
    private categoryRepository: Repository<Category>;

    constructor() {
        this.repository = AppDataSource.getRepository(Product);
        this.categoryRepository = AppDataSource.getRepository(Category);
    }

    async createProduct(data: Partial<Product>): Promise<Product> {
        const product = this.repository.create(data);
        await this.repository.save(product);
        return product;
    }

    async findProductById(id: number): Promise<Product | null> {
        return await this.repository.findOne({ 
            where: { id }, 
            relations: ['category'] 
        }) || null;
    }

    async findAllProducts(category_Id?: number): Promise<Product[]> {
        if (category_Id) {
            return await this.repository.find({ 
                where: { category: { id: category_Id } }, 
                relations: ['category'] 
            });
        }
        return await this.repository.find({ relations: ['category'] });
    }

    public async validateCategory(category_id: number): Promise<Category> {
        const category = await this.categoryRepository.findOne({ where: { id: category_id } });
        if (!category) {
            throw new ApiError(`Categoria com ID ${category_id} não encontrada.`, 404);
        }
        return category;
    }

    public validateProductFields(body: any): void {
        const { description, quantity_stock, value, category_id } = body;
        if (!description || quantity_stock === undefined || value === undefined || !category_id) {
            throw new ApiError('Descrição, quantidade em estoque, valor e ID da categoria são obrigatórios.', 400);
        }
    }

    public async updateProduct(productData: { id: number; description: string; quantity_stock: number; value: string; category_id: number }): Promise<Product> {
        const { id, description, quantity_stock, value, category_id } = productData;

        const product = await this.repository.findOne({ where: { id } });
        if (!product) {
            throw new ApiError(`Produto com ID ${id} não encontrado.`, 404);
        }

        product.description = description;
        product.quantity_stock = quantity_stock;
        product.value = value;

        const category = await this.categoryRepository.findOne({ where: { id: category_id } });
        if (!category) {
            throw new ApiError(`Categoria com ID ${category_id} não encontrada.`, 404);
        }

        product.category = category;
        await this.repository.save(product);

        return product;
    }

    public async isProductInOrders(productId: number): Promise<boolean> {
        const orderRepository = AppDataSource.getRepository(Order);
        
        const ordersWithProduct = await orderRepository.createQueryBuilder("order")
            .innerJoin("order.product", "orderProduct") 
            .where("orderProduct.product.id = :productId", { productId }) 
            .getMany();
    
        return ordersWithProduct.length > 0;
    }
    
    public async deleteProduct(id: number): Promise<void> {
        await this.repository.delete(id);
    }
}
