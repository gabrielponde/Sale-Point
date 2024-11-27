import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Categories1727636063217 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: 'categories',
            columns: [
                {
                    name: 'id',
                    type: 'serial',
                    isPrimary: true,
                },
                {
                    name: 'description',
                    type: 'text',
                },
            ],
        });
        await queryRunner.createTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('categories');
    }
}
