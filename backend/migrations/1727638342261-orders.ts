import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class Orders1727638342261 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'orders',
                columns: [
                    {
                        name: 'id',
                        type: 'serial',
                        isPrimary: true,
                    },
                    {
                        name: 'client_id',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'observation',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'total_value',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        isNullable: false,
                    },
                ],
            })
        );

        await queryRunner.createForeignKey(
            'orders',
            new TableForeignKey({
                columnNames: ['client_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'clients',
                onDelete: 'CASCADE',
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('orders', 'FK_orders_client_id');

        await queryRunner.dropTable('orders');
    }
}
