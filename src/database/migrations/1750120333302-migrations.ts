import { MigrationInterface, QueryRunner } from 'typeorm';

/* Create Products Tags Table */
export class Migrations1750120333302 implements MigrationInterface {
  name = 'Migrations1750120333302';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "products_tags" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "product_id" integer, "tag_id" integer, "created_by_user_id" integer, CONSTRAINT "PK_d2adb73cab6259d69fe83a77432" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "products_tags" ADD CONSTRAINT "FK_5bea8057797206c034871344d9d" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products_tags" ADD CONSTRAINT "FK_050fd68b81f130e2eafca1d672d" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products_tags" ADD CONSTRAINT "FK_7e4506787e56acac3a072ea60d8" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products_tags" DROP CONSTRAINT "FK_7e4506787e56acac3a072ea60d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products_tags" DROP CONSTRAINT "FK_050fd68b81f130e2eafca1d672d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products_tags" DROP CONSTRAINT "FK_5bea8057797206c034871344d9d"`,
    );
    await queryRunner.query(`DROP TABLE "products_tags"`);
  }
}
