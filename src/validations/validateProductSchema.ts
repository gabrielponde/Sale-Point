import Joi from 'joi';
import { ApiError } from '../helpers/api-error';

const productSchema = Joi.object({
    description: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'A descrição é obrigatória.',
        'string.min': 'A descrição deve ter pelo menos 3 caracteres.',
        'string.max': 'A descrição deve ter no máximo 100 caracteres.',
    }),
    quantity_stock: Joi.number().integer().min(0).required().messages({
        'number.base': 'A quantidade em estoque deve ser um número.',
        'number.integer': 'A quantidade em estoque deve ser um número inteiro.',
        'number.min': 'A quantidade em estoque não pode ser negativa.',
    }),
    value: Joi.number().positive().required().messages({
        'number.base': 'O valor deve ser um número.',
        'number.positive': 'O valor deve ser positivo.',
    }),
    category_id: Joi.number().integer().required().messages({
        'number.base': 'O ID da categoria deve ser um número.',
        'number.integer': 'O ID da categoria deve ser um número inteiro.',
    }),
});

export const validateProductData = (data: any) => {
    const { error } = productSchema.validate(data);
    if (error) {
        throw new ApiError(error.details[0].message, 400);
    }
};
