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
        console.log('Verificando variáveis de ambiente...');
        
        // Verifica variáveis de ambiente necessárias
        const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME', 'DB_PORT'];
        const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
        
        if (missingEnvVars.length > 0) {
            throw new Error(`Variáveis de ambiente faltando: ${missingEnvVars.join(', ')}`);
        }

        console.log('Tentando conectar ao banco de dados...');
        console.log('Configuração do banco:', {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: process.env.DB_USER
        });
        
        // Inicializa o banco de dados
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            console.log('Banco de dados inicializado com sucesso!');
        }

        // Inicia o servidor
        const port = process.env.PORT || 3333;
        app.listen(port, () => {
            console.log(`Servidor rodando na porta ${port}`);
            console.log('CORS habilitado para todas as origens');
        });
    } catch (error) {
        console.error('Erro ao iniciar servidor:', error);
        console.error('Detalhes do erro:', {
            message: error.message,
            stack: error.stack
        });
        // Não encerra o processo, apenas loga o erro
        console.error('Servidor continuará rodando mesmo com erro no banco de dados');
    }
}

// Inicia o servidor
startServer();

export default app; 