import { AppDataSource } from '../config/data-source'; 
import { Category } from '../models/Category';

export const CategoryRepository = AppDataSource.getRepository(Category);
