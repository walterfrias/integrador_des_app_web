import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddObservacionToContacto1779100000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contactos_clientes" ADD COLUMN IF NOT EXISTS "observacion" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contactos_clientes" DROP COLUMN IF EXISTS "observacion"`,
    );
  }
}
