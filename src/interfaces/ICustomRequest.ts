import { Request } from 'express';

export interface ICustomRequest extends Request {
    file?: Express.Multer.File;
}
