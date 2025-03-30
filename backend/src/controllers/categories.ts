import { Request, Response } from 'express';
import { CategoryRepository } from '../repositories/categoriesRepository';
import { ApiError } from '../helpers/api-error';

export class CategoryController {
    private categoryRepository: CategoryRepository;

    constructor() {
        this.categoryRepository = new CategoryRepository();
    }

    async list(req: Request, res: Response): Promise<Response> {
        const categories = await this.categoryRepository.findAll();
        return res.status(200).json(categories);
    }

    async create(req: Request, res: Response): Promise<Response> {
        const { description } = req.body;

        if (!description) {
            throw new ApiError('Descrição é obrigatória', 400);
        }

        const category = await this.categoryRepository.create(description);
        return res.status(201).json(category);
    }

    async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { description } = req.body;

        if (!description) {
            throw new ApiError('Descrição é obrigatória', 400);
        }

        try {
            const category = await this.categoryRepository.update(Number(id), description);
            return res.status(200).json(category);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Erro ao atualizar categoria', 500);
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            await this.categoryRepository.delete(Number(id));
            return res.status(204).send();
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Erro ao excluir categoria', 500);
        }
    }

    async getById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        
        const category = await this.categoryRepository.findById(Number(id));
        if (!category) {
            throw new ApiError('Categoria não encontrada', 404);
        }

        return res.status(200).json(category);
    }
}
