import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPhoneToClients1728076493541 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Primeiro adiciona a coluna como nullable
        await queryRunner.addColumn(
            'clients',
            new TableColumn({
                name: 'phone',
                type: 'varchar',
                length: '20',
                isNullable: true,
            })
        );

        // Atualiza os registros existentes com um valor padrão
        await queryRunner.query(`UPDATE clients SET phone = '00000000000' WHERE phone IS NULL`);

        // Torna a coluna NOT NULL
        await queryRunner.changeColumn(
            'clients',
            'phone',
            new TableColumn({
                name: 'phone',
                type: 'varchar',
                length: '20',
                isNullable: false,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('clients', 'phone');
    }
} 