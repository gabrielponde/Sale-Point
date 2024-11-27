import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source';
import { User } from '../models/User';

const validateToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Unauthorized.' });
    }

    try {
        const token = authorization.replace('Bearer ', '').trim();

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOneBy({ id: decoded.id });

        if (!existingUser) {
            return res.status(401).json({ mensagem: 'Invalid or expired login.' });
        }

        req.user = existingUser;

        next();
    } catch (error) {
        return res.status(500).json({ mensagem: 'Internal Server Error.' });
    }
};

export default validateToken;
