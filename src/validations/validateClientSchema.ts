import Joi from 'joi';
import { ApiError } from '../helpers/api-error';

const clientSchema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'O nome é obrigatório.',
        'string.min': 'O nome deve ter pelo menos 3 caracteres.',
        'string.max': 'O nome deve ter no máximo 50 caracteres.'
    }),
    email: Joi.string().email().required().messages({
        'string.empty': 'O email é obrigatório.',
        'string.email': 'O email deve ser válido.'
    }),
    cpf: Joi.string().length(11).pattern(/^\d+$/).required().messages({
        'string.empty': 'O CPF é obrigatório.',
        'string.length': 'O CPF deve ter exatamente 11 dígitos.',
        'string.pattern.base': 'O CPF deve conter apenas números.'
    }),
    cep: Joi.string().length(8).pattern(/^\d+$/).required().messages({
        'string.empty': 'O CEP é obrigatório.',
        'string.length': 'O CEP deve ter exatamente 8 dígitos.',
        'string.pattern.base': 'O CEP deve conter apenas números.'
    }),
    street: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'A rua é obrigatória.',
        'string.min': 'A rua deve ter pelo menos 3 caracteres.',
        'string.max': 'A rua deve ter no máximo 100 caracteres.'
    }),
    number: Joi.string().required().messages({
        'string.empty': 'O número é obrigatório.'
    }),
    district: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'O bairro é obrigatório.',
        'string.min': 'O bairro deve ter pelo menos 3 caracteres.',
        'string.max': 'O bairro deve ter no máximo 50 caracteres.'
    }),
    city: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'A cidade é obrigatória.',
        'string.min': 'A cidade deve ter pelo menos 3 caracteres.',
        'string.max': 'A cidade deve ter no máximo 50 caracteres.'
    }),
    state: Joi.string().length(2).pattern(/^[A-Z]{2}$/).required().messages({
        'string.empty': 'O estado é obrigatório.',
        'string.length': 'O estado deve ter exatamente 2 caracteres.',
        'string.pattern.base': 'O estado deve conter apenas letras maiúsculas.'
    })
});

export const validateClientData = (data: any) => {
    const { error } = clientSchema.validate(data);
    if (error) {
        throw new ApiError(error.details[0].message, 400);
    }
};
