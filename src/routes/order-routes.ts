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

export default orderRoutes;
