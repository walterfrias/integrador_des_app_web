import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1777132604533 implements MigrationInterface {
    name = 'InitialSchema1777132604533'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."contactos_clientes_tipo_enum" AS ENUM('TELEFONO', 'EMAIL')`);
        await queryRunner.query(`CREATE TABLE "contactos_clientes" ("id" SERIAL NOT NULL, "tipo" "public"."contactos_clientes_tipo_enum" NOT NULL, "valor" character varying NOT NULL, "clienteId" integer, CONSTRAINT "PK_5d7e70463db4b31bf6735c55f40" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."clientes_estado_enum" AS ENUM('ACTIVO', 'BAJA')`);
        await queryRunner.query(`CREATE TABLE "clientes" ("id" SERIAL NOT NULL, "nombre" character varying NOT NULL, "estado" "public"."clientes_estado_enum" NOT NULL DEFAULT 'ACTIVO', CONSTRAINT "UQ_fa1e326586a05f459771ac6ba89" UNIQUE ("nombre"), CONSTRAINT "PK_d76bf3571d906e4e86470482c08" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."proyectos_estado_enum" AS ENUM('ACTIVO', 'FINALIZADO', 'BAJA')`);
        await queryRunner.query(`CREATE TABLE "proyectos" ("id" SERIAL NOT NULL, "nombre" character varying NOT NULL, "estado" "public"."proyectos_estado_enum" NOT NULL DEFAULT 'ACTIVO', "fechaLimite" date, "clienteId" integer, CONSTRAINT "UQ_b53cc54cdb4f19fc1c5aebff49f" UNIQUE ("nombre"), CONSTRAINT "PK_4763a49914127cbdde2143db52a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."tareas_estado_enum" AS ENUM('PENDIENTE', 'FINALIZADA', 'BAJA')`);
        await queryRunner.query(`CREATE TABLE "tareas" ("id" SERIAL NOT NULL, "descripcion" text NOT NULL, "estado" "public"."tareas_estado_enum" NOT NULL DEFAULT 'PENDIENTE', "proyectoId" integer, CONSTRAINT "PK_9370ac1b0569cacf8cda6815c97" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."usuarios_rol_enum" AS ENUM('ADMIN', 'OPERADOR')`);
        await queryRunner.query(`CREATE TYPE "public"."usuarios_estado_enum" AS ENUM('ACTIVO', 'BAJA')`);
        await queryRunner.query(`CREATE TABLE "usuarios" ("id" SERIAL NOT NULL, "nombre" character varying NOT NULL, "clave" character varying NOT NULL, "rol" "public"."usuarios_rol_enum" NOT NULL DEFAULT 'OPERADOR', "estado" "public"."usuarios_estado_enum" NOT NULL DEFAULT 'ACTIVO', CONSTRAINT "UQ_8699a5bc72f5c2ca7c46b420e88" UNIQUE ("nombre"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contactos_clientes" ADD CONSTRAINT "FK_102a3c364d2b0e48c7d4ffffe76" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "proyectos" ADD CONSTRAINT "FK_e3c8dbc966209b56cc53c81ddb1" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tareas" ADD CONSTRAINT "FK_616e0a706d4308df7dc8addc87a" FOREIGN KEY ("proyectoId") REFERENCES "proyectos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tareas" DROP CONSTRAINT "FK_616e0a706d4308df7dc8addc87a"`);
        await queryRunner.query(`ALTER TABLE "proyectos" DROP CONSTRAINT "FK_e3c8dbc966209b56cc53c81ddb1"`);
        await queryRunner.query(`ALTER TABLE "contactos_clientes" DROP CONSTRAINT "FK_102a3c364d2b0e48c7d4ffffe76"`);
        await queryRunner.query(`DROP TABLE "usuarios"`);
        await queryRunner.query(`DROP TYPE "public"."usuarios_estado_enum"`);
        await queryRunner.query(`DROP TYPE "public"."usuarios_rol_enum"`);
        await queryRunner.query(`DROP TABLE "tareas"`);
        await queryRunner.query(`DROP TYPE "public"."tareas_estado_enum"`);
        await queryRunner.query(`DROP TABLE "proyectos"`);
        await queryRunner.query(`DROP TYPE "public"."proyectos_estado_enum"`);
        await queryRunner.query(`DROP TABLE "clientes"`);
        await queryRunner.query(`DROP TYPE "public"."clientes_estado_enum"`);
        await queryRunner.query(`DROP TABLE "contactos_clientes"`);
        await queryRunner.query(`DROP TYPE "public"."contactos_clientes_tipo_enum"`);
    }

}
