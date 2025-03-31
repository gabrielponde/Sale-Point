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
	ssl: {
		rejectUnauthorized: false,
		ca: process.env.SUPABASE_SSL_CERT
	},
	extra: {
		ssl: {
			rejectUnauthorized: false
		}
	}
})

// Adicionando logs para debug
AppDataSource.initialize()
	.then(() => {
		console.log('Data Source inicializado com sucesso!');
	})
	.catch((error) => {
		console.error('Erro ao inicializar Data Source:', error);
		console.error('Detalhes do erro:', {
			message: error.message,
			code: error.code,
			errno: error.errno,
			syscall: error.syscall,
			hostname: error.hostname
		});
	});
