import { Router, Request, Response } from 'express';
import { UserController } from '../controllers/users';
import validateToken from '../middlewares/validateToken';
import {
    registerSchema,
    loginSchema,
    resetPasswordSchema,
    editUserSchema,
} from '../validations/validateUserSchema'; 

const userRoutes = Router();
const userController = new UserController();

userRoutes.get('/', validateToken, async (req: Request, res: Response): Promise<any> => {
    return userController.getUserDetails(req, res);
});

userRoutes.post('/register', async (req: Request, res: Response): Promise<any> => {
    await registerSchema.validateAsync(req.body); 
    return userController.register(req, res);
});

userRoutes.post('/login', async (req: Request, res: Response): Promise<any> => {
    await loginSchema.validateAsync(req.body); 
    return userController.login(req, res);
});

userRoutes.patch('/reset', validateToken, async (req: Request, res: Response): Promise<any> => {
    await resetPasswordSchema.validateAsync(req.body); 
    return userController.resetPassword(req, res);
});

userRoutes.put('/', validateToken, async (req: Request, res: Response): Promise<any> => {
    await editUserSchema.validateAsync(req.body); 
    return userController.editUser(req, res);
});

export default userRoutes;
