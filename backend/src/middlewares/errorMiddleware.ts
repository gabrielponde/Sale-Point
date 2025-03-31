import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../helpers/api-error';
import { EntityMetadataNotFoundError, QueryFailedError } from 'typeorm';

export const errorMiddleware = async (err: Error & Partial<ApiError>, req: Request, res: Response, next: NextFunction): Promise<any> => {
    console.error('Erro:', err);

    // Se for um erro de API (nossos erros customizados)
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ 
            message: err.message,
            statusCode: err.statusCode
        });
    }

    // Se for um erro de validação do Joi
    if (err.name === 'ValidationError') {
        return res.status(400).json({ 
            message: err.message,
            statusCode: 400
        });
    }

    // Se for um erro de entidade não encontrada
    if (err instanceof EntityMetadataNotFoundError) {
        console.error('Entity metadata error:', {
            message: err.message,
            stack: err.stack
        });
        return res.status(500).json({ 
            message: 'Erro de configuração do banco de dados. Por favor, contate o suporte.',
            statusCode: 500
        });
    }

    // Se for um erro de violação de chave estrangeira
    if (err instanceof QueryFailedError && err.message.includes('violates foreign key constraint')) {
        return res.status(400).json({ 
            message: 'Não é possível excluir este item pois ele está vinculado a outros registros.',
            statusCode: 400
        });
    }

    // Se for um erro de conexão com o banco
    if (err.message.includes('ECONNREFUSED') || err.message.includes('getaddrinfo')) {
        console.error('Database connection error:', {
            message: err.message,
            stack: err.stack
        });
        return res.status(503).json({ 
            message: 'Serviço temporariamente indisponível. Por favor, tente novamente mais tarde.',
            statusCode: 503
        });
    }

    // Erro padrão
    return res.status(500).json({ 
        message: 'Erro interno do servidor',
        statusCode: 500
    });
}