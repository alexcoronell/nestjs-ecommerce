import { MigrationInterface, QueryRunner } from 'typeorm';

/* Create Product Suppliers Table */
export class Migrations1750983919575 implements MigrationInterface {
  name = 'Migrations1750983919575';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product_suppliers" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "is_deleted" boolean NOT NULL DEFAULT false, "supplier_product_code" character varying(256) NOT NULL, "cost_price" numeric(10) NOT NULL DEFAULT '0', "is_primary_supplier" boolean NOT NULL DEFAULT false, "product_id" integer, "supplier_id" integer, "created_by_user_id" integer, "updated_by_user_id" integer, "deleted_by_user_id" integer, CONSTRAINT "PK_96f9e4cfe1a097fdd2a9a67257a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_suppliers" ADD CONSTRAINT "FK_c1b61c92463463f577fac49b95c" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_suppliers" ADD CONSTRAINT "FK_be4a36f37c7345ab274ec4656d2" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_suppliers" ADD CONSTRAINT "FK_6764e5ab172245e60e9a4020232" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_suppliers" ADD CONSTRAINT "FK_b90d66a2ce63d6855f5073318f6" FOREIGN KEY ("updated_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_suppliers" ADD CONSTRAINT "FK_ce47daf62b0c2e2c9f2763d4ca6" FOREIGN KEY ("deleted_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_suppliers" DROP CONSTRAINT "FK_ce47daf62b0c2e2c9f2763d4ca6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_suppliers" DROP CONSTRAINT "FK_b90d66a2ce63d6855f5073318f6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_suppliers" DROP CONSTRAINT "FK_6764e5ab172245e60e9a4020232"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_suppliers" DROP CONSTRAINT "FK_be4a36f37c7345ab274ec4656d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_suppliers" DROP CONSTRAINT "FK_c1b61c92463463f577fac49b95c"`,
    );
    await queryRunner.query(`DROP TABLE "product_suppliers"`);
  }
}
