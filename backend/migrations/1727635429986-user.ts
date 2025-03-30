import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class User1727635429986 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: 'users',
            columns: [
                {
                    name: 'id',
                    type: 'serial',
                    isPrimary: true,
                },
                {
                    name: 'name',
                    type: 'text',
                    isNullable: false, 
                },
                {
                    name: 'email',
                    type: 'text',
                    isNullable: false, 
                    isUnique: true, 
                },
                {
                    name: 'password',
                    type: 'text',
                    isNullable: false, 
                },
            ],
        });
        await queryRunner.createTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users');
    }
}
