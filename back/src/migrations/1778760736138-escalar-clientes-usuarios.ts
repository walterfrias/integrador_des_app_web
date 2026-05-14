import { MigrationInterface, QueryRunner } from "typeorm";

export class EscalarClientesUsuarios1778760736138 implements MigrationInterface {
    name = 'EscalarClientesUsuarios1778760736138'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clientes" ADD "cuit" character varying`);
        await queryRunner.query(`ALTER TABLE "clientes" ADD CONSTRAINT "UQ_4e4e45a41c5515a2be18332550e" UNIQUE ("cuit")`);
        await queryRunner.query(`ALTER TABLE "clientes" ADD "direccion" character varying`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "apellido" character varying`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "email" character varying`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "cuil" character varying`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD CONSTRAINT "UQ_fcfefd42e72560db18c39409970" UNIQUE ("cuil")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" DROP CONSTRAINT "UQ_fcfefd42e72560db18c39409970"`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "cuil"`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5"`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "apellido"`);
        await queryRunner.query(`ALTER TABLE "clientes" DROP COLUMN "direccion"`);
        await queryRunner.query(`ALTER TABLE "clientes" DROP CONSTRAINT "UQ_4e4e45a41c5515a2be18332550e"`);
        await queryRunner.query(`ALTER TABLE "clientes" DROP COLUMN "cuit"`);
    }

}
