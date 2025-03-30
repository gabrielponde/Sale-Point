import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class Products1727636277234 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: 'products',
            columns: [
                {
                    name: 'id',
                    type: 'serial', 
                    isPrimary: true,
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: false, 
                },
                {
                    name: 'quantity_stock',
                    type: 'integer',
                    isNullable: false, 
                },
                {
                    name: 'value',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                    isNullable: false, 
                },
                {
                    name: 'category_id',
                    type: 'integer',
                    isNullable: false, 
                },
                {
                    name: 'image_url',
                    type: 'text',
                    isNullable: true,
                },
            ],
        });

        await queryRunner.createTable(table);

        const foreignKey = new TableForeignKey({
            columnNames: ['category_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'categories',
            onDelete: 'CASCADE',
            name: 'FK_products_category_id' 
        });

        await queryRunner.createForeignKey('products', foreignKey);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('products', 'FK_products_category_id');

        await queryRunner.dropTable('products');
    }
}