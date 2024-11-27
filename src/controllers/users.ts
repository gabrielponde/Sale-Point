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
        const { error } = registerSchema.validate(req.body);
        if (error) {
            throw new ApiError(error.details[0].message, 400);
        }
    
        const { name, email, password } = req.body;
    
        const user = await this.userService.registerUser(name, email, password);
        
        return res.status(201).json({
            id: user.id,    
            nome: user.name,
            email: user.email
        });
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

        const { email, oldPassword, newPassword } = req.body;
        const userName = await this.userService.resetPassword(email, oldPassword, newPassword);

        const htmlTemplatePath = path.join(__dirname, '../emails/resetPasswordEmail.html');
        let html = await fs.readFile(htmlTemplatePath, 'utf-8');

        html = html.replace('${userName}', userName);

        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: email,
            subject: 'Alteração de Senha POS',
            html,
        };

        await transporter.sendMail(mailOptions);
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
