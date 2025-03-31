import 'dotenv/config'
import 'reflect-metadata'; 
import express from 'express';
import cors from 'cors'; 
import morgan from 'morgan'; 
import { AppDataSource } from './data-source';
import routes from '../routes/app-routes';
import { errorMiddleware } from '../middlewares/errorMiddleware';

AppDataSource.initialize()
    .then(() => {
        const app = express();

        // Configuração otimizada do CORS
        app.use(cors({
            origin: [
                'https://sale-point-app.vercel.app',
                'https://sale-point-app.vercel.app/'
            ],
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true
        }));

        app.use(express.json());
        app.use(morgan('dev'));

        // Rotas
        app.use(routes);
        
        // Middleware de erro (mantém por último)
        app.use(errorMiddleware);

        const port = process.env.PORT || 3333;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(error => {
        console.error('Error during Data Source initialization:', error);
    });