import 'dotenv/config';
import 'reflect-metadata'; 
import express from 'express';
import morgan from 'morgan'; 
import { getConnection, checkConnection } from './config/data-source';
import routes from './routes/app-routes';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { corsMiddleware } from './config/cors';

const app = express();

// Middleware básico
app.use(corsMiddleware);
app.use(express.json());

// Morgan apenas em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', async (_, res) => {
    const isHealthy = await checkConnection();
    if (isHealthy) {
        res.json({ status: 'healthy', database: 'connected' });
    } else {
        res.status(503).json({ status: 'unhealthy', database: 'disconnected' });
    }
});

// Rota de teste
app.get('/', (_, res) => {
    res.json({ message: 'API is running!' });
});

// Middleware otimizado para conexão com banco
app.use(async (req, res, next) => {
    // Ignora a verificação de banco para OPTIONS e health check
    if (req.method === 'OPTIONS' || req.path === '/health') {
        return next();
    }

    try {
        // Usa o sistema de conexão otimizado
        await getConnection();
        next();
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(503).json({ 
            error: 'Service temporarily unavailable',
            message: 'Database connection failed'
        });
    }
});

// Rotas da aplicação
app.use(routes);

// Middleware de erro
app.use(errorMiddleware);

// Inicializa a conexão com o banco ao iniciar o servidor
getConnection()
    .then(() => console.log('Initial database connection established'))
    .catch(error => console.error('Initial database connection failed:', error));

// Exporta o app para o Vercel
export default app;

// Inicia o servidor em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3333;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}