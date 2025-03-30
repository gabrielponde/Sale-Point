import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddTimestampsToOrders1728076493541 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('orders', [
            new TableColumn({
                name: 'created_at',
                type: 'timestamp',
                default: 'now()',
                isNullable: false,
            }),
            new TableColumn({
                name: 'updated_at',
                type: 'timestamp',
                default: 'now()',
                isNullable: false,
            })
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('orders', 'created_at');
        await queryRunner.dropColumn('orders', 'updated_at');
    }
} 