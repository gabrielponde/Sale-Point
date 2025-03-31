import 'dotenv/config'
import 'reflect-metadata'; 
import express from 'express';
import morgan from 'morgan'; 
import { AppDataSource } from '../src/config/data-source';
import routes from '../src/routes/app-routes';
import { errorMiddleware } from '../src/middlewares/errorMiddleware';
import { corsMiddleware } from '../src/config/cors';

const app = express();

// Configuração do CORS
app.use(corsMiddleware);

app.use(express.json());
app.use(morgan('dev'));

// Rotas
app.use(routes);

// Middleware de erro
app.use(errorMiddleware);

// Inicializa o banco de dados e inicia o servidor
AppDataSource.initialize()
    .then(() => {
        const port = process.env.PORT || 3333;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(error => {
        console.error('Error during Data Source initialization:', error);
    });

export default app; 