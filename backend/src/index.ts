import 'dotenv/config'
import 'reflect-metadata'; 
import express from 'express';
import morgan from 'morgan'; 
import { AppDataSource } from './config/data-source';
import routes from './routes/app-routes';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { corsMiddleware } from './config/cors';

AppDataSource.initialize()
    .then(() => {
        const app = express();

        // Configuração do CORS
        app.use(corsMiddleware);

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