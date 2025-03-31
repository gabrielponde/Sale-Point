import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { createTransporter } from '../config/nodemailer';
import { registerSchema, loginSchema, resetPasswordSchema, editUserSchema } from '../validations/validateUserSchema';
import { ApiError } from '../helpers/api-error';
import jwt from 'jsonwebtoken';
import path from 'path';
import { promises as fs } from 'fs';

export class UserController {
    private readonly userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async register(req: Request, res: Response) {
        try {
            console.log('Recebida requisição de registro:', { ...req.body, password: '[REDACTED]' });
            
            const { error } = registerSchema.validate(req.body);
            if (error) {
                console.log('Erro de validação:', error.details[0].message);
                throw new ApiError(error.details[0].message, 400);
            }
        
            const { name, email, password } = req.body;
            console.log('Dados validados, tentando registrar usuário');
        
            const user = await this.userService.registerUser(name, email, password);
            console.log('Usuário registrado com sucesso');
            
            return res.status(201).json({
                id: user.id,    
                nome: user.name,
                email: user.email
            });
        } catch (error) {
            console.error('Erro no controller de registro:', error);
            if (error instanceof ApiError) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    
    async login(req: Request, res: Response) {
        const { error } = loginSchema.validate(req.body);
        if (error) {
            throw new ApiError(error.details[0].message, 400);
        }

        const { email, password } = req.body;
        const { user } = await this.userService.loginUser(email, password);

        const secret = process.env.JWT_SECRET as string;
        const token = jwt.sign({ id: user.id }, secret, { expiresIn: '8h' });

        const { password: _, ...userData } = user; 
        return res.status(200).json({
            usuario: userData,
            token
        });
    }

    async resetPassword(req: Request, res: Response) {
        const { error } = resetPasswordSchema.validate(req.body);
        if (error) {
            throw new ApiError(error.details[0].message, 400);
        }

        if (!req.user) {
            throw new ApiError('Usuário não está logado.', 401);
        }

        const { oldPassword, newPassword } = req.body;
        const { id } = req.user as { id: number };
        const userName = await this.userService.resetPassword(id, oldPassword, newPassword);

        try {
            const htmlTemplatePath = path.join(__dirname, '../emails/resetPasswordEmail.html');
            let html = await fs.readFile(htmlTemplatePath, 'utf-8');

            html = html.replace('${userName}', userName);

            const transporter = createTransporter();
            console.log('Configuração do email:', {
                host: process.env.HOST_EMAIL,
                port: process.env.PORT_EMAIL,
                user: process.env.USER_EMAIL,
            });

            const mailOptions = {
                from: process.env.USER_EMAIL,
                to: (req.user as { email: string }).email,
                subject: 'Alteração de Senha POS',
                html,
            };

            console.log('Tentando enviar email para:', (req.user as { email: string }).email);
            await transporter.sendMail(mailOptions);
            console.log('Email enviado com sucesso!');
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            // Não vamos lançar o erro aqui, apenas logar
        }

        return res.status(200).json({ mensagem: 'Senha alterada com sucesso.' });
    }

    async getUserDetails(req: Request, res: Response) {
        if (!req.user) {
            throw new ApiError('Usuário não está logado.', 401);
        }

        const { id, name, email } = req.user as { id: number, name: string, email: string };
        return res.status(200).json({ id, name, email });
    }

    async editUser(req: Request, res: Response) {
        const { error } = editUserSchema.validate(req.body);
        if (error) {
            throw new ApiError(error.details[0].message, 400);
        }

        const { name, email } = req.body;
        const { id } = req.user as { id: number };

        await this.userService.editUser(id, name, email);
        return res.status(204).send();
    }
}
