import { Request, Response } from 'express';
import { CategoryRepository } from '../repositories/categoriesRepository'; 
import { Category } from '../models/Category'; 

export class CategoryController {
    async listar(req: Request, res: Response) {
        const categories: Category[] = await CategoryRepository.find();
        return res.status(200).json(categories);
    }
}
