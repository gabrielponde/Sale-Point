import { Router } from 'express';
import userRoutes from './user-routes';
import productRoutes from './product-routes';
import clientRoutes from './client-routes';
import orderRoutes from './order-routes';
import categoryRoutes from './category-routes'; 

const routes = Router();

routes.get('/', (req, res) => {
    res.json('Welcome to the POS!');
});

routes.use('/user', userRoutes);
routes.use('/product', productRoutes);
routes.use('/client', clientRoutes);
routes.use('/order', orderRoutes);
routes.use('/categories', categoryRoutes);

export default routes;
