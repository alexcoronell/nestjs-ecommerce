import { MigrationInterface, QueryRunner } from 'typeorm';

/* Create Shipping Companies Table */
export class Migrations1747338967549 implements MigrationInterface {
  name = 'Migrations1747338967549';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "shipping_companies" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "is_deleted" boolean NOT NULL DEFAULT false, "name" character varying(255) NOT NULL, "contact_name" character varying(255) NOT NULL, "phone_number" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "created_by_user_id" integer, "updated_by_user_id" integer, "deleted_by_user_id" integer, CONSTRAINT "UQ_1f03c466e47e3ead5f2cab2ac28" UNIQUE ("name"), CONSTRAINT "UQ_221d5888a11f2ef225b53f98481" UNIQUE ("contact_name"), CONSTRAINT "UQ_92ad65d9a6a57bf6e8af4d54bb8" UNIQUE ("email"), CONSTRAINT "PK_122b86979b5555bc48d807d7f13" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "shipping_companies" ADD CONSTRAINT "FK_49f15f37b940f5de7e783f6acd0" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "shipping_companies" ADD CONSTRAINT "FK_c4d0a8d282575aaa40f711cb9bc" FOREIGN KEY ("updated_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "shipping_companies" ADD CONSTRAINT "FK_03aa7d8acba8e6a0e430ab646ce" FOREIGN KEY ("deleted_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "shipping_companies" DROP CONSTRAINT "FK_03aa7d8acba8e6a0e430ab646ce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shipping_companies" DROP CONSTRAINT "FK_c4d0a8d282575aaa40f711cb9bc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shipping_companies" DROP CONSTRAINT "FK_49f15f37b940f5de7e783f6acd0"`,
    );
    await queryRunner.query(`DROP TABLE "shipping_companies"`);
  }
}
