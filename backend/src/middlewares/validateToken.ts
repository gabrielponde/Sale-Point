import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source';
import { User } from '../models/User';

// Extendendo a interface Request do Express para incluir o user
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

const validateToken = (req: Request, res: Response, next: NextFunction): void => {
    const { authorization } = req.headers;

    if (!authorization) {
        res.status(401).json({ mensagem: 'Unauthorized.' });
        return;
    }

    try {
        const token = authorization.replace('Bearer ', '').trim();

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

        const userRepository = AppDataSource.getRepository(User);
        userRepository.findOneBy({ id: decoded.id })
            .then(existingUser => {
                if (!existingUser) {
                    res.status(401).json({ mensagem: 'Invalid or expired login.' });
                    return;
                }

                req.user = existingUser;
                next();
            })
            .catch(error => {
                res.status(500).json({ mensagem: 'Internal Server Error.' });
            });
    } catch (error) {
        res.status(500).json({ mensagem: 'Internal Server Error.' });
    }
};

export default validateToken;