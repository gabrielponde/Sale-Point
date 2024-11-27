import nodemailer, { Transporter } from 'nodemailer';

export const createTransporter = (): Transporter => {
    return nodemailer.createTransport({
        host: process.env.HOST_EMAIL, 
        port: Number(process.env.PORT_EMAIL), 
        secure: false,
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.PASS_EMAIL,
        },
    });
};


