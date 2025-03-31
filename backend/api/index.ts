import 'dotenv/config'
import 'reflect-metadata'; 
import express from 'express';
import cors from 'cors';
import { AppDataSource } from '../src/config/data-source';
import routes from '../src/routes/app-routes';
import { errorMiddleware } from '../src/middlewares/errorMiddleware';
import { corsMiddleware } from '../src/config/cors';

const app = express();

// Middleware para logging de requisições
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    next();
});

// Configuração do CORS (deve vir antes de outras configurações)
app.use(corsMiddleware);

// Configurações básicas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota básica para a raiz
app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

// Rotas da aplicação
app.use(routes);

// Middleware de erro (deve ser o último)
app.use(errorMiddleware);

// Função para iniciar o servidor
async function startServer() {
    try {
        console.log('Iniciando servidor...');
        console.log('Tentando conectar ao banco de dados...');
        
        // Inicializa o banco de dados
        await AppDataSource.initialize();
        console.log('Banco de dados inicializado com sucesso!');

        // Inicia o servidor
        const port = process.env.PORT || 3333;
        app.listen(port, () => {
            console.log(`Servidor rodando na porta ${port}`);
            console.log('CORS habilitado para todas as origens');
        });
    } catch (error) {
        console.error('Erro ao iniciar servidor:', error);
        process.exit(1);
    }
}

// Inicia o servidor
startServer();

export default app; 