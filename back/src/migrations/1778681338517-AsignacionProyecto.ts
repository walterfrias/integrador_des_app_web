import { MigrationInterface, QueryRunner } from "typeorm";

export class AsignacionProyecto1778681338517 implements MigrationInterface {
    name = 'AsignacionProyecto1778681338517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."asignaciones_proyecto_estado_enum" AS ENUM('ACTIVO', 'BAJA')`);
        await queryRunner.query(`CREATE TABLE "asignaciones_proyecto" ("id" SERIAL NOT NULL, "estado" "public"."asignaciones_proyecto_estado_enum" NOT NULL DEFAULT 'ACTIVO', "fechaAsignacion" date NOT NULL DEFAULT ('now'::text)::date, "usuarioId" integer NOT NULL, "proyectoId" integer NOT NULL, CONSTRAINT "PK_0e4e2ae46bb1a80545aac9a5627" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "asignaciones_proyecto" ADD CONSTRAINT "FK_7f01a1360969c74813b18f8d777" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asignaciones_proyecto" ADD CONSTRAINT "FK_7c0fcbf5c86ff4d8f9c35d5c70e" FOREIGN KEY ("proyectoId") REFERENCES "proyectos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "asignaciones_proyecto" DROP CONSTRAINT "FK_7c0fcbf5c86ff4d8f9c35d5c70e"`);
        await queryRunner.query(`ALTER TABLE "asignaciones_proyecto" DROP CONSTRAINT "FK_7f01a1360969c74813b18f8d777"`);
        await queryRunner.query(`DROP TABLE "asignaciones_proyecto"`);
        await queryRunner.query(`DROP TYPE "public"."asignaciones_proyecto_estado_enum"`);
    }

}
