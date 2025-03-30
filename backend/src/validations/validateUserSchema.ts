import Joi from 'joi';
import { ApiError } from '../helpers/api-error';

export const registerSchema = Joi.object({
    name: Joi.string().min(3).required().messages({
        'string.empty': 'O nome é obrigatório.',
        'string.min': 'O nome deve ter pelo menos 3 caracteres.',
    }),
    email: Joi.string().email().required().messages({
        'string.empty': 'O e-mail é obrigatório.',
        'string.email': 'O e-mail deve ser válido.',
    }),
    password: Joi.string().min(6).required().messages({
        'string.empty': 'A senha é obrigatória.',
        'string.min': 'A senha deve ter pelo menos 6 caracteres.',
    }),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.empty': 'O e-mail é obrigatório.',
        'string.email': 'O e-mail deve ser válido.',
    }),
    password: Joi.string().required().messages({
        'string.empty': 'A senha é obrigatória.',
    }),
});

export const resetPasswordSchema = Joi.object({
    oldPassword: Joi.string().required().messages({
        'string.empty': 'A senha antiga é obrigatória.',
    }),
    newPassword: Joi.string().min(6).not(Joi.ref('oldPassword')).required().messages({
        'string.empty': 'A nova senha é obrigatória.',
        'string.min': 'A nova senha deve ter pelo menos 6 caracteres.',
        'any.only': 'A nova senha não pode ser igual à senha antiga.',
    }),
});

export const editUserSchema = Joi.object({
    name: Joi.string().min(3).required().messages({
        'string.empty': 'O nome é obrigatório.',
        'string.min': 'O nome deve ter pelo menos 3 caracteres.',
    }),
    email: Joi.string().email().required().messages({
        'string.empty': 'O e-mail é obrigatório.',
        'string.email': 'O e-mail deve ser válido.',
    }),
});

export const validateRegisterData = (data: any) => {
    const { error } = registerSchema.validate(data);
    if (error) {
        throw new ApiError(error.details[0].message, 400);
    }
};

export const validateLoginData = (data: any) => {
    const { error } = loginSchema.validate(data);
    if (error) {
        throw new ApiError(error.details[0].message, 400);
    }
};

export const validateResetPasswordData = (data: any) => {
    const { error } = resetPasswordSchema.validate(data);
    if (error) {
        throw new ApiError(error.details[0].message, 400);
    }
};

export const validateEditUserData = (data: any) => {
    const { error } = editUserSchema.validate(data);
    if (error) {
        throw new ApiError(error.details[0].message, 400);
    }
};
