import 'dotenv/config'
import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from '../models/User'

const port = process.env.DB_PORT as number | undefined

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.DB_HOST,
	port: port,
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	migrations: ['migrations/*.ts'],
	entities: [User],
	synchronize: false,
	logging: true,
	ssl: {
		rejectUnauthorized: false
	}
})

// Adicionando logs para debug
AppDataSource.initialize()
	.then(() => {
		console.log('Data Source inicializado com sucesso!');
	})
	.catch((error) => {
		console.error('Erro ao inicializar Data Source:', error);
	});
