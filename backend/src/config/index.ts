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
            origin: 'http://localhost:3000', // Permite apenas o frontend Next.js
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Métodos permitidos
            allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
            credentials: true // Permite cookies/sessão se necessário
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