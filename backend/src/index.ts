import 'dotenv/config';
import 'reflect-metadata'; 
import express from 'express';
import morgan from 'morgan'; 
import { AppDataSource } from './config/data-source';
import routes from './routes/app-routes';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { corsMiddleware } from './config/cors';

const app = express();

// Middleware básico
app.use(corsMiddleware);
app.use(express.json());
app.use(morgan('dev'));

// Rota de teste
app.get('/', (_, res) => {
    res.json({ message: 'API is running!' });
});

// Middleware otimizado para conexão com banco em ambiente serverless
app.use(async (req, res, next) => {
    try {
        // Se já estiver conectado, continua
        if (AppDataSource.isInitialized) {
            return next();
        }

        console.log('Tentando conectar ao banco...');
        const startTime = Date.now();
        
        // Tenta inicializar a conexão
        await AppDataSource.initialize();
        
        const endTime = Date.now();
        console.log(`Conexão estabelecida em ${endTime - startTime}ms`);
        
        next();
    } catch (error) {
        console.error('Erro na conexão com o banco:', error);
        
        // Se a conexão já existir mas estiver com problema, tenta destruir
        if (AppDataSource.isInitialized) {
            try {
                await AppDataSource.destroy();
                console.log('Conexão antiga destruída');
            } catch (destroyError) {
                console.error('Erro ao destruir conexão:', destroyError);
            }
        }
        
        res.status(503).json({ 
            error: 'Database connection failed',
            message: 'Unable to connect to the database. Please try again.'
        });
    }
});

// Rotas da aplicação
app.use(routes);

// Middleware de erro
app.use(errorMiddleware);

// Exporta o app para o Vercel
export default app;

// Inicia o servidor em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3333;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}