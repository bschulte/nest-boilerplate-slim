import {MigrationInterface, QueryRunner} from "typeorm";

export class init1595292471701 implements MigrationInterface {
    name = 'init1595292471701'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "email" character varying NOT NULL, "password" character varying NOT NULL, "passwordResetToken" character varying, "passwordResetTokenExpires" TIMESTAMP, "role" character varying NOT NULL DEFAULT 'USER', "permissions" text NOT NULL DEFAULT '', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
