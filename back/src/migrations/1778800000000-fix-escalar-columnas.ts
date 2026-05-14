import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixEscalarColumnas1778800000000 implements MigrationInterface {
  name = 'FixEscalarColumnas1778800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "clientes" ADD COLUMN IF NOT EXISTS "cuit" character varying`);
    await queryRunner.query(`ALTER TABLE "clientes" ADD COLUMN IF NOT EXISTS "direccion" character varying`);
    await queryRunner.query(`ALTER TABLE "usuarios" ADD COLUMN IF NOT EXISTS "apellido" character varying`);
    await queryRunner.query(`ALTER TABLE "usuarios" ADD COLUMN IF NOT EXISTS "email" character varying`);
    await queryRunner.query(`ALTER TABLE "usuarios" ADD COLUMN IF NOT EXISTS "cuil" character varying`);

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE constraint_name = 'UQ_4e4e45a41c5515a2be18332550e'
        ) THEN
          ALTER TABLE "clientes" ADD CONSTRAINT "UQ_4e4e45a41c5515a2be18332550e" UNIQUE ("cuit");
        END IF;
      END $$
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE constraint_name = 'UQ_446adfc18b35418aac32ae0b7b5'
        ) THEN
          ALTER TABLE "usuarios" ADD CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email");
        END IF;
      END $$
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE constraint_name = 'UQ_fcfefd42e72560db18c39409970'
        ) THEN
          ALTER TABLE "usuarios" ADD CONSTRAINT "UQ_fcfefd42e72560db18c39409970" UNIQUE ("cuil");
        END IF;
      END $$
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN IF EXISTS "cuil"`);
    await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN IF EXISTS "email"`);
    await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN IF EXISTS "apellido"`);
    await queryRunner.query(`ALTER TABLE "clientes" DROP COLUMN IF EXISTS "direccion"`);
    await queryRunner.query(`ALTER TABLE "clientes" DROP COLUMN IF EXISTS "cuit"`);
  }
}
