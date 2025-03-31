import 'dotenv/config'
import 'reflect-metadata'; 
import express from 'express';
import morgan from 'morgan'; 
import { AppDataSource } from './config/data-source';
import routes from './routes/app-routes';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { corsMiddleware } from './config/cors';

const app = express();

// Configuração do CORS
app.use(corsMiddleware);

app.use(express.json());
app.use(morgan('dev'));

// Rota de teste
app.get('/', (req, res) => {
    res.json({ message: 'API is running!' });
});

// Rotas
app.use(routes);

// Middleware de erro (mantém por último)
app.use(errorMiddleware);

// Inicializa o banco de dados
AppDataSource.initialize()
    .then(() => {
        console.log('Database connection established');
    })
    .catch((error: Error) => {
        console.error('Error during Data Source initialization:', error);
    });

// Exporta o app para o Vercel
export default app;

// Inicia o servidor apenas se não estiver rodando no Vercel
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3333;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
} 