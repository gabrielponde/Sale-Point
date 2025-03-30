import { Router, Request, Response } from 'express';
import { OrderController } from '../controllers/orders';
import validateToken from '../middlewares/validateToken';

const orderRoutes = Router();
const orderController = new OrderController();

orderRoutes.post('/', validateToken, async (req: Request, res: Response): Promise<any> => {
    return orderController.register(req, res);
});

orderRoutes.get('/', validateToken, async (req: Request, res: Response): Promise<any> => {
    return orderController.list(req, res);
});

orderRoutes.delete('/:id', validateToken, async (req: Request, res: Response): Promise<any> => {
    return orderController.delete(req, res);
});

orderRoutes.put('/:id', validateToken, async (req: Request, res: Response): Promise<any> => {
    return orderController.update(req, res);
});

export default orderRoutes;
