import { Request, Response } from 'express';
import { ProductRepository } from '../repositories/productsRepository';
import { ApiError } from '../helpers/api-error';
import { ProductFormatterImpl } from '../interfaces/implementations/ProductFormatterImpl';
import { IProductResponse } from '../interfaces/IProductResponse';
import { uploadFile, excluirImagem } from '../services/fileUploadService';
import { AppDataSource } from '../config/data-source';
import { validateProductData } from '../validations/validateProductSchema';
import { Product } from '../models/Product';

export class ProductController {
    private readonly productRepository: ProductRepository;
    private readonly productFormatter: ProductFormatterImpl;

    constructor() {
        this.productRepository = new ProductRepository();
        this.productFormatter = new ProductFormatterImpl();
    }

    async createProduct(req: Request, res: Response): Promise<Response> {
        validateProductData(req.body); 

        const { description, quantity_stock, value, category_id } = req.body;
        const category = await this.productRepository.validateCategory(category_id);

        const product = await this.productRepository.createProduct({
            description,
            quantity_stock,
            value,
            category,
            image_url: '', 
        });

        const formattedProduct: IProductResponse = this.productFormatter.formatProduct(product, category.id);

        return res.status(201).json({
            message: 'Produto criado com sucesso.',
            product: formattedProduct,
        });
    }

    async getProducts(req: Request, res: Response): Promise<Response> {
        const { category_id } = req.query;
        const products = await this.productRepository.findAllProducts(category_id ? Number(category_id) : undefined);
        
        const formattedProducts: IProductResponse[] = products.map(product =>
            this.productFormatter.formatProduct(product, product.category.id)
        );

        return res.status(200).json(formattedProducts);
    }
    
    async getProductById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const product = await this.productRepository.findProductById(Number(id));
        if (!product) {
            throw new ApiError(`Produto com ID ${id} não encontrado.`, 404);
        }

        const formattedProduct: IProductResponse = this.productFormatter.formatProduct(product, product.category.id);

        return res.status(200).json({ product: formattedProduct });
    }

    async updateProduct(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        validateProductData(req.body); 

        const { description, quantity_stock, value, category_id } = req.body;
        const product = await this.productRepository.findProductById(Number(id));
        if (!product) {
            throw new ApiError(`Produto com ID ${id} não encontrado.`, 404);
        }

        const category = await this.productRepository.validateCategory(category_id);
        
        const updatedProduct = await this.productRepository.updateProduct({
            id: Number(id),
            description,
            quantity_stock,
            value,
            category_id: category.id,
        });

        const formattedProduct: IProductResponse = this.productFormatter.formatProduct(updatedProduct, category.id);

        return res.status(200).json({
            message: 'Produto atualizado com sucesso.',
            product: formattedProduct,
        });
    }

    async deleteProduct(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
    
        const product = await this.productRepository.findProductById(Number(id));
        if (!product) {
            throw new ApiError('Produto não encontrado.', 404);
        }
    
        const isInOrders = await this.productRepository.isProductInOrders(product.id);
    
        if (isInOrders) {
            throw new ApiError('Produto não pode ser excluído porque possui pedidos vinculados.', 400);
        }
    
        await this.productRepository.deleteProduct(Number(id));
    
        return res.status(204).send();
    }

    async uploadImage(req: Request, res: Response): Promise<Response | void> {
        const { file } = req;
        const { id } = req.params;

        const productRepository = AppDataSource.getRepository(Product);
        const product = await productRepository.findOne({ where: { id: Number(id) } });
        if (!product) {
            throw new ApiError('Produto não encontrado.', 404);
        }
    
        if (!file && !product.image_url) {
            return res.status(200).json({
                mensagem: 'A imagem do produto já está atualizada.',
                imagem_url: null
            });
        }
    
        if (file) {
            const arquivo = await uploadFile(
                file.originalname,
                file.buffer,
                file.mimetype
            );
    
            if (product.image_url) {
                const keyAntiga = product.image_url.split('/').pop() as string;
                await excluirImagem(keyAntiga);
            }
    
            product.image_url = arquivo.url;
            await productRepository.save(product);
    
            return res.status(201).json({ mensagem: 'Imagem carregada com sucesso!', image_url: arquivo.url });
        } else if (product.image_url) {
                const keyAntiga = product.image_url.split('/').pop() as string;
                await excluirImagem(keyAntiga);
    
                product.image_url = '';
                await productRepository.save(product);
    
                return res.status(200).json({
                    mensagem: 'Imagem antiga removida com sucesso!',
                    imagem_url: null
                });
            }
    }
}
