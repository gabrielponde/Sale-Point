import { Router, Request, Response } from 'express';
import userRoutes from './user-routes';
import productRoutes from './product-routes';
import clientRoutes from './client-routes';
import orderRoutes from './order-routes';
import categoryRoutes from './category-routes';
import { DashboardController } from '../controllers/dashboard';
import validateToken from '../middlewares/validateToken';

const routes = Router();
const dashboardController = new DashboardController();

routes.get('/dashboard/stats', validateToken, (req: Request, res: Response) => {
    dashboardController.getStats(req, res);
});

routes.use('/user', userRoutes);
routes.use('/product', productRoutes);
routes.use('/client', clientRoutes);
routes.use('/order', orderRoutes);
routes.use('/categories', categoryRoutes);

export default routes;
