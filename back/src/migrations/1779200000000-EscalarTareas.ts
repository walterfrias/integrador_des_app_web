import { MigrationInterface, QueryRunner } from 'typeorm';

export class EscalarTareas1779200000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DO $$ BEGIN
         IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tareas_prioridad_enum') THEN
           CREATE TYPE "tareas_prioridad_enum" AS ENUM ('BAJA', 'MEDIA', 'ALTA');
         END IF;
       END $$`,
    );

    await queryRunner.query(
      `ALTER TABLE "tareas"
         ADD COLUMN IF NOT EXISTS "prioridad" "tareas_prioridad_enum" NOT NULL DEFAULT 'MEDIA',
         ADD COLUMN IF NOT EXISTS "fecha_limite" date`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tareas"
         DROP COLUMN IF EXISTS "prioridad",
         DROP COLUMN IF EXISTS "fecha_limite"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "tareas_prioridad_enum"`,
    );
  }
}
