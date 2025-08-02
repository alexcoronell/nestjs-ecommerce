import { MigrationInterface, QueryRunner } from 'typeorm';

/* Create Purchase Details Table */
export class Migrations1754172678432 implements MigrationInterface {
  name = 'Migrations1754172678432';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "purchase_details" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "is_deleted" boolean NOT NULL DEFAULT false, "quantity" integer NOT NULL DEFAULT '1', "unit_price" numeric(10,2) NOT NULL, "subtotal" numeric(10,2) NOT NULL, "purchase_id" integer NOT NULL, "product_id" integer NOT NULL, "created_by_user_id" integer NOT NULL, "updated_by_user_id" integer, "deleted_by_user_id" integer, CONSTRAINT "UQ_de27b4793e5a45ab80f2160ea06" UNIQUE ("purchase_id", "product_id"), CONSTRAINT "PK_d3ebfb1c6f9af260a2a63af7204" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_details" ADD CONSTRAINT "FK_7769941f7424a0030e1f6c7b7d3" FOREIGN KEY ("purchase_id") REFERENCES "purchases"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_details" ADD CONSTRAINT "FK_802cd8f2a3c2e09932fc1bfad88" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_details" ADD CONSTRAINT "FK_12a79156fe302c9bd6e92a5c8b5" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_details" ADD CONSTRAINT "FK_6df107b3911f837c3b906c6cf49" FOREIGN KEY ("updated_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_details" ADD CONSTRAINT "FK_f7a65d6e51dba96a7c457e4d76d" FOREIGN KEY ("deleted_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purchase_details" DROP CONSTRAINT "FK_f7a65d6e51dba96a7c457e4d76d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_details" DROP CONSTRAINT "FK_6df107b3911f837c3b906c6cf49"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_details" DROP CONSTRAINT "FK_12a79156fe302c9bd6e92a5c8b5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_details" DROP CONSTRAINT "FK_802cd8f2a3c2e09932fc1bfad88"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_details" DROP CONSTRAINT "FK_7769941f7424a0030e1f6c7b7d3"`,
    );
    await queryRunner.query(`DROP TABLE "purchase_details"`);
  }
}
