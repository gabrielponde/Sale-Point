import 'dotenv/config'
import 'reflect-metadata'; 
import express from 'express';
import morgan from 'morgan'; 
import { AppDataSource } from '../src/config/data-source';
import routes from '../src/routes/app-routes';
import { errorMiddleware } from '../src/middlewares/errorMiddleware';
import { corsMiddleware } from '../src/config/cors';

const app = express();

// Middleware para log de requisições
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Configuração do CORS (deve vir antes de outras configurações)
app.use(corsMiddleware);

// Configurações básicas
app.use(express.json());
app.use(morgan('dev'));

// Rota básica para a raiz
app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

// Rotas da aplicação
app.use(routes);

// Middleware de erro (deve vir por último)
app.use(errorMiddleware);

// Inicializa o banco de dados e inicia o servidor
AppDataSource.initialize()
    .then(() => {
        const port = process.env.PORT || 3333;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
            console.log('CORS enabled for all origins');
        });
    })
    .catch(error => {
        console.error('Error during Data Source initialization:', error);
    });

export default app; 