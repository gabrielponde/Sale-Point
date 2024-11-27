import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Clients1727638192543 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'clients',
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
                        type: 'varchar',
                        length: '50',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'cpf',
                        type: 'varchar',
                        length: '14',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'cep',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'street',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'number',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'district',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'city',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'state',
                        type: 'text',
                        isNullable: true,
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('clients');
    }
}
