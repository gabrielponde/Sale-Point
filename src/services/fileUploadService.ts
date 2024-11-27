import { IUploadFileResponse } from '../interfaces/IUploadFileResponse';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';


const SUPABASE_URL = process.env.SUPABASE_URL as string;

const s3 = new S3Client({
    endpoint: process.env.ENDPOINT_S3,
    region: 'sa-east-1',
    credentials: {
        accessKeyId: process.env.KEY_ID as string,
        secretAccessKey: process.env.APP_KEY as string,
    },
    forcePathStyle: true
});

export const uploadFile = async (originalName: string, buffer: Buffer, mimetype: string): Promise<IUploadFileResponse> => {
    const nomeUnico = `${uuidv4()}${path.extname(originalName)}`;

    const command = new PutObjectCommand({
        Bucket: process.env.SUPABASE_BUCKET as string,
        Key: nomeUnico,
        Body: buffer,
        ContentType: mimetype,
    });

    await s3.send(command);

    const urlPublica = `${SUPABASE_URL}/storage/v1/object/public/PDV%20Imagens/${nomeUnico}`;

    return {
        url: urlPublica,
        path: nomeUnico,
    };
};

export const excluirImagem = async (key: string): Promise<void> => {
    const command = new DeleteObjectCommand({
        Bucket: process.env.SUPABASE_BUCKET as string,
        Key: key,
    });

    await s3.send(command);
};
