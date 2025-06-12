import { MigrationInterface, QueryRunner } from 'typeorm';

/* Create Discounts Table */
export class Migrations1749759900663 implements MigrationInterface {
  name = 'Migrations1749759900663';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "discounts" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "is_deleted" boolean NOT NULL DEFAULT false, "code" character varying(255) NOT NULL, "description" text NOT NULL, "type" character varying(50) NOT NULL, "value" numeric(10,2) NOT NULL, "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP, "minimum_order_amount" numeric(10,2) NOT NULL DEFAULT '0', "usage_limit" integer, "usage_limit_per_user" integer, "active" boolean NOT NULL DEFAULT false, "created_by_user_id" integer, "updated_by_user_id" integer, "deleted_by_user_id" integer, CONSTRAINT "PK_66c522004212dc814d6e2f14ecc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "discounts" ADD CONSTRAINT "FK_2ccc2274a324a4a2059d8af4c59" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "discounts" ADD CONSTRAINT "FK_84fd406dd8c0aae51a0a741491b" FOREIGN KEY ("updated_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "discounts" ADD CONSTRAINT "FK_2bfecd199eed6a03dbebd5da919" FOREIGN KEY ("deleted_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "discounts" DROP CONSTRAINT "FK_2bfecd199eed6a03dbebd5da919"`,
    );
    await queryRunner.query(
      `ALTER TABLE "discounts" DROP CONSTRAINT "FK_84fd406dd8c0aae51a0a741491b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "discounts" DROP CONSTRAINT "FK_2ccc2274a324a4a2059d8af4c59"`,
    );
    await queryRunner.query(`DROP TABLE "discounts"`);
  }
}
