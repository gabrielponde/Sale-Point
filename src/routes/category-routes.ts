import { CategoryController } from "../controllers/categories";
import { Router, Request, Response } from 'express';

const categoryRoutes = Router();
const categoryController = new CategoryController();

categoryRoutes.get('/', async (req: Request, res: Response): Promise<any> => {
    return categoryController.listar(req, res);
});

export default categoryRoutes;