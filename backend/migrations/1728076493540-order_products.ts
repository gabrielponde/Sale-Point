import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class OrderProducts1728076493540 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'order_products',
                columns: [
                    {
                        name: 'id',
                        type: 'serial',
                        isPrimary: true,
                    },
                    {
                        name: 'order_id',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'product_id',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'quantity_product',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'product_value',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        isNullable: false,
                    },
                ],
            })
        );

        await queryRunner.createForeignKey(
            'order_products',
            new TableForeignKey({
                columnNames: ['order_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'orders',
                onDelete: 'CASCADE',
            })
        );

        await queryRunner.createForeignKey(
            'order_products',
            new TableForeignKey({
                columnNames: ['product_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'products',
                onDelete: 'CASCADE', 
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('order_products', 'FK_product_orders_product_id');

        await queryRunner.dropForeignKey('order_products', 'FK_product_orders_order_id');

        await queryRunner.dropTable('order_products');
    }
}
