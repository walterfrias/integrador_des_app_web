import { MigrationInterface, QueryRunner } from "typeorm";

export class AddResponsableToTarea1779027848624 implements MigrationInterface {
    name = 'AddResponsableToTarea1779027848624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tareas" ADD "fecha_creacion" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tareas" ADD "fecha_actualizacion" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tareas" ADD "usuario_id" integer`);
        await queryRunner.query(`ALTER TABLE "tareas" ADD CONSTRAINT "FK_29799ff2d68fa2a97751981cf31" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tareas" DROP CONSTRAINT "FK_29799ff2d68fa2a97751981cf31"`);
        await queryRunner.query(`ALTER TABLE "tareas" DROP COLUMN "usuario_id"`);
        await queryRunner.query(`ALTER TABLE "tareas" DROP COLUMN "fecha_actualizacion"`);
        await queryRunner.query(`ALTER TABLE "tareas" DROP COLUMN "fecha_creacion"`);
    }

}
