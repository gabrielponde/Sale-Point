import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../helpers/api-error';

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

    // Se for um erro de violação de chave estrangeira
    if (err.name === 'QueryFailedError' && err.message.includes('violates foreign key constraint')) {
        return res.status(400).json({ 
            message: 'Não é possível excluir este item pois ele está vinculado a outros registros.',
            statusCode: 400
        });
    }

    // Erro padrão
    return res.status(500).json({ 
        message: 'Erro interno do servidor',
        statusCode: 500
    });
}