import { Router, Request, Response } from 'express';
import { ClientController } from '../controllers/clients';
import validateToken from '../middlewares/validateToken';
import { validateClientData } from '../validations/validateClientSchema';

const clientRoutes = Router();
const clientController = new ClientController();

clientRoutes.post('/', validateToken, async (req: Request, res: Response): Promise<any> => {
    validateClientData(req.body);
    return clientController.register(req, res);
});

clientRoutes.put('/:id', validateToken, async (req: Request, res: Response): Promise<any> => {
    validateClientData(req.body);
    return clientController.edit(req, res);
});

clientRoutes.get('/', validateToken, async (req: Request, res: Response): Promise<any> => {
    return clientController.list(req, res);
});

clientRoutes.get('/:id', validateToken, async (req: Request, res: Response): Promise<any> => {
    return clientController.getDetails(req, res);
});

clientRoutes.delete('/:id', validateToken, async (req: Request, res: Response): Promise<any> => {
    return clientController.delete(req, res);
});

export default clientRoutes;
