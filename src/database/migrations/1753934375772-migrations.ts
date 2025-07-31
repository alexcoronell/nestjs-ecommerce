import { MigrationInterface, QueryRunner } from 'typeorm';

/* Create Sales Table */
export class Migrations1753934375772 implements MigrationInterface {
  name = 'Migrations1753934375772';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sales" ("id" SERIAL NOT NULL, "sale_date" TIMESTAMP NOT NULL DEFAULT now(), "total_amount" numeric(10,2) NOT NULL DEFAULT '0', "shipping_address" character varying(255) NOT NULL, "billing_status" character varying(100) NOT NULL, "cancelled_at" TIMESTAMP DEFAULT now(), "is_cancelled" boolean NOT NULL DEFAULT false, "user_id" integer, "cancelled_by_user_id" integer, "payment_method_id" integer, "shipping_company_id" integer, CONSTRAINT "PK_4f0bc990ae81dba46da680895ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "wishlist" ("id" SERIAL NOT NULL, "added_date" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, "product_id" integer NOT NULL, CONSTRAINT "UQ_c00c97c645a6be88349354e8f38" UNIQUE ("user_id", "product_id"), CONSTRAINT "PK_620bff4a240d66c357b5d820eaa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "discounts" DROP CONSTRAINT "UQ_8c7cc2340e9ea0fc5a246e63749"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales" ADD CONSTRAINT "FK_5f282f3656814ec9ca2675aef6f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales" ADD CONSTRAINT "FK_6cb2ccd2a3b2aa23c6ab9564a22" FOREIGN KEY ("cancelled_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales" ADD CONSTRAINT "FK_b53046ece141355db11e7750c11" FOREIGN KEY ("payment_method_id") REFERENCES "payment_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales" ADD CONSTRAINT "FK_c5b6b9a50d9e34202257be33f1c" FOREIGN KEY ("shipping_company_id") REFERENCES "shipping_companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist" ADD CONSTRAINT "FK_512bf776587ad5fc4f804277d76" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist" ADD CONSTRAINT "FK_16f64e06715ce4fea8257cc42c5" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wishlist" DROP CONSTRAINT "FK_16f64e06715ce4fea8257cc42c5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist" DROP CONSTRAINT "FK_512bf776587ad5fc4f804277d76"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales" DROP CONSTRAINT "FK_c5b6b9a50d9e34202257be33f1c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales" DROP CONSTRAINT "FK_b53046ece141355db11e7750c11"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales" DROP CONSTRAINT "FK_6cb2ccd2a3b2aa23c6ab9564a22"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales" DROP CONSTRAINT "FK_5f282f3656814ec9ca2675aef6f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "discounts" ADD CONSTRAINT "UQ_8c7cc2340e9ea0fc5a246e63749" UNIQUE ("code")`,
    );
    await queryRunner.query(`DROP TABLE "wishlist"`);
    await queryRunner.query(`DROP TABLE "sales"`);
  }
}
