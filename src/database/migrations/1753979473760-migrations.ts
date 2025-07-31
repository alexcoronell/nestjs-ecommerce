import { MigrationInterface, QueryRunner } from 'typeorm';

/* Create Sale Details Table */
export class Migrations1753979473760 implements MigrationInterface {
  name = 'Migrations1753979473760';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sale_detail" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL DEFAULT '1', "unit_price" numeric(10,2) NOT NULL, "subtotal" numeric(10,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "price" numeric(10,2) NOT NULL, "sale_id" integer NOT NULL, "product_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "UQ_5c834a675e4e5161cd1d221459a" UNIQUE ("sale_id", "product_id"), CONSTRAINT "PK_4a2e151a26169857b1f3d47c198" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_detail" ADD CONSTRAINT "FK_f51acf047cb9b82ea8b0508f95a" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_detail" ADD CONSTRAINT "FK_6f193a6e12bed09dc343ad057ab" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_detail" ADD CONSTRAINT "FK_41169dd77349b5f72f58ef04a2b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sale_detail" DROP CONSTRAINT "FK_41169dd77349b5f72f58ef04a2b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_detail" DROP CONSTRAINT "FK_6f193a6e12bed09dc343ad057ab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_detail" DROP CONSTRAINT "FK_f51acf047cb9b82ea8b0508f95a"`,
    );
    await queryRunner.query(`DROP TABLE "sale_detail"`);
  }
}
