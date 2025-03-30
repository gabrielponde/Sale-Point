import { CategoryController } from "../controllers/categories";
import { Router, Request, Response } from 'express';
import validateToken from '../middlewares/validateToken';

const categoryRoutes = Router();
const categoryController = new CategoryController();

// Lista todas as categorias
categoryRoutes.get('/', validateToken, async (req: Request, res: Response): Promise<any> => {
    return categoryController.list(req, res);
});

// Busca uma categoria por ID
categoryRoutes.get('/:id', validateToken, async (req: Request, res: Response): Promise<any> => {
    return categoryController.getById(req, res);
});

// Cria uma nova categoria
categoryRoutes.post('/', validateToken, async (req: Request, res: Response): Promise<any> => {
    return categoryController.create(req, res);
});

// Atualiza uma categoria
categoryRoutes.put('/:id', validateToken, async (req: Request, res: Response): Promise<any> => {
    return categoryController.update(req, res);
});

// Exclui uma categoria
categoryRoutes.delete('/:id', validateToken, async (req: Request, res: Response): Promise<any> => {
    return categoryController.delete(req, res);
});

export default categoryRoutes;