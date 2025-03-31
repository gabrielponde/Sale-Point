import 'dotenv/config'
import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from '../models/User'

const port = process.env.DB_PORT as number | undefined

console.log('Configurando conexão com o banco de dados...');
console.log('Host:', process.env.DB_HOST);
console.log('Port:', process.env.DB_PORT);
console.log('Database:', process.env.DB_NAME);
console.log('User:', process.env.DB_USER);

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
	ssl: true,
	extra: {
		ssl: {
			rejectUnauthorized: false
		}
	},
	entityPrefix: 'public',
	schema: 'public'
})

// Não inicializa o DataSource aqui, deixe o servidor fazer isso
