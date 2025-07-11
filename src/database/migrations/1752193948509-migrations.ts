import { MigrationInterface, QueryRunner } from 'typeorm';

/* Create Product Discounts Table */
export class Migrations1752193948509 implements MigrationInterface {
  name = 'Migrations1752193948509';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product_discounts" ("product_id" integer NOT NULL, "discount_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_user_id" integer NOT NULL, CONSTRAINT "PK_fb73d2ec2c65bb88066e43a7d03" PRIMARY KEY ("product_id", "discount_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_discounts" ADD CONSTRAINT "FK_1d869169a655cbdf787d86ea745" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_discounts" ADD CONSTRAINT "FK_68e668b0341f0276ebcc2a91506" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_discounts" ADD CONSTRAINT "FK_4d3f74396271c6bee81a1a547a0" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_discounts" DROP CONSTRAINT "FK_4d3f74396271c6bee81a1a547a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_discounts" DROP CONSTRAINT "FK_68e668b0341f0276ebcc2a91506"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_discounts" DROP CONSTRAINT "FK_1d869169a655cbdf787d86ea745"`,
    );
    await queryRunner.query(`DROP TABLE "product_discounts"`);
  }
}
