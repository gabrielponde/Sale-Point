import { Router, Request, Response } from 'express';
import { ProductController } from '../controllers/products';
import validateToken from '../middlewares/validateToken';
import multer from 'multer';
import { ICustomRequest } from '../interfaces/ICustomRequest';
import { validateProductData } from '../validations/validateProductSchema'; 

const productRoutes = Router();
const upload = multer();
const productController = new ProductController();

productRoutes.post('/', validateToken, async (req: Request, res: Response): Promise<any> => {
    validateProductData(req.body); 
    return productController.createProduct(req, res);
});

productRoutes.get('/', validateToken, async (req: Request, res: Response): Promise<any> => {
    return productController.getProducts(req, res);
});

productRoutes.get('/:id', validateToken, async (req: Request, res: Response): Promise<any> => {
    return productController.getProductById(req, res);
});

productRoutes.put('/:id', validateToken, async (req: Request, res: Response): Promise<any> => {
    validateProductData(req.body); 
    return productController.updateProduct(req, res);
});

productRoutes.delete('/:id', validateToken, async (req: Request, res: Response): Promise<any> => {
    return productController.deleteProduct(req, res);
});

productRoutes.patch('/:id/image', validateToken, upload.single('image'), async (req: ICustomRequest, res: Response): Promise<any> => {
    return productController.uploadImage(req, res);
});

export default productRoutes;
