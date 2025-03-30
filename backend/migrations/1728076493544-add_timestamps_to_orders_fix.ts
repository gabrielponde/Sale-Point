import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTimestampsToOrdersFix1728076493544 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Primeiro, verifica se as colunas já existem
        const hasCreatedAt = await queryRunner.hasColumn('orders', 'created_at');
        const hasUpdatedAt = await queryRunner.hasColumn('orders', 'updated_at');

        // Adiciona created_at se não existir
        if (!hasCreatedAt) {
            await queryRunner.query(`
                ALTER TABLE orders 
                ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            `);
        }

        // Adiciona updated_at se não existir
        if (!hasUpdatedAt) {
            await queryRunner.query(`
                ALTER TABLE orders 
                ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove as colunas se existirem
        const hasCreatedAt = await queryRunner.hasColumn('orders', 'created_at');
        const hasUpdatedAt = await queryRunner.hasColumn('orders', 'updated_at');

        if (hasUpdatedAt) {
            await queryRunner.query(`
                ALTER TABLE orders 
                DROP COLUMN updated_at
            `);
        }

        if (hasCreatedAt) {
            await queryRunner.query(`
                ALTER TABLE orders 
                DROP COLUMN created_at
            `);
        }
    }
} 