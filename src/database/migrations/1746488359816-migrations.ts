import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1746488359816 implements MigrationInterface {
    name = 'Migrations1746488359816'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "is_deleted" boolean NOT NULL DEFAULT false, "first_name" character varying(255) NOT NULL, "last_name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "address" character varying(255) NOT NULL, "neighborhood" character varying(255) NOT NULL, "phone_number" character varying(255) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "created_by_user_id" integer, "updated_by_user_id" integer, "deleted_by_user_id" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_3402191df44bc05c18c1cbbdc92" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_2deb726a6f596b0bace60b216f0" FOREIGN KEY ("updated_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_518416801da6ad5b2f318079a8e" FOREIGN KEY ("deleted_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_518416801da6ad5b2f318079a8e"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_2deb726a6f596b0bace60b216f0"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_3402191df44bc05c18c1cbbdc92"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
