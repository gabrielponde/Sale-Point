import { AppDataSource } from '../config/data-source';
import { Category } from '../models/Category';
import { Repository } from 'typeorm';
import { ApiError } from '../helpers/api-error';

export class CategoryRepository {
    private repository: Repository<Category>;

    constructor() {
        this.repository = AppDataSource.getRepository(Category);
    }

    async findAll(): Promise<Category[]> {
        return await this.repository.find();
    }

    async findById(id: number): Promise<Category | null> {
        return await this.repository.findOne({ 
            where: { id },
            relations: ['products']
        });
    }

    async create(description: string): Promise<Category> {
        const category = this.repository.create({ description });
        return await this.repository.save(category);
    }

    async update(id: number, description: string): Promise<Category> {
        const category = await this.findById(id);
        if (!category) {
            throw new ApiError('Categoria não encontrada', 404);
        }

        category.description = description;
        return await this.repository.save(category);
    }

    async delete(id: number): Promise<void> {
        const category = await this.findById(id);
        if (!category) {
            throw new ApiError('Categoria não encontrada', 404);
        }

        if (category.products && category.products.length > 0) {
            throw new ApiError('Não é possível excluir uma categoria que possui produtos vinculados', 400);
        }

        await this.repository.remove(category);
    }
}
