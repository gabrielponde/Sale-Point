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

// Define as entidades explicitamente
const entities = [User];

// Log das entidades para debug
console.log('Entidades carregadas:', entities.map(e => e.name));

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.DB_HOST,
	port: port,
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	migrations: ['migrations/*.ts'],
	entities: entities,
	synchronize: false,
	logging: true,
	ssl: true,
	extra: {
		ssl: {
			rejectUnauthorized: false
		}
	},
	entityPrefix: 'public',
	schema: 'public',
	useUTC: true,
	cache: false,
	maxQueryExecutionTime: 1000,
	logger: 'advanced-console',
	dropSchema: false,
	migrationsRun: false,
	migrationsTableName: 'migrations',
	migrationsTransactionMode: 'each'
})

// Não inicializa o DataSource aqui, deixe o servidor fazer isso
