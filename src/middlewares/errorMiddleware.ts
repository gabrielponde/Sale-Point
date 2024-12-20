import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../helpers/api-error';

export const errorMiddleware = async (err: Error & Partial<ApiError>, req: Request, res: Response, next: NextFunction): Promise<any> => {
    const statusCode = err.statusCode ?? 500
    return res.status(statusCode).json({ message: err.message })
}