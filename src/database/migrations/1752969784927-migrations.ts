import { MigrationInterface, QueryRunner } from 'typeorm';

/* Changes in the products_tags table to remove the id column and
set a composite primary key on product_id and tag_id,
ensuring both columns are not null and maintaining foreign key constraints. */

export class Migrations1752969784927 implements MigrationInterface {
  name = 'Migrations1752969784927';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products_tags" DROP CONSTRAINT "FK_5bea8057797206c034871344d9d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products_tags" DROP CONSTRAINT "FK_050fd68b81f130e2eafca1d672d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products_tags" DROP CONSTRAINT "PK_d2adb73cab6259d69fe83a77432"`,
    );
    await queryRunner.query(`ALTER TABLE "products_tags" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "products_tags" ADD CONSTRAINT "PK_cbd06afc39cd795196e15bcc72d" PRIMARY KEY ("product_id", "tag_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "products_tags" ALTER COLUMN "product_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "products_tags" ALTER COLUMN "tag_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "products_tags" ADD CONSTRAINT "FK_5bea8057797206c034871344d9d" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products_tags" ADD CONSTRAINT "FK_050fd68b81f130e2eafca1d672d" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products_tags" DROP CONSTRAINT "FK_050fd68b81f130e2eafca1d672d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products_tags" DROP CONSTRAINT "FK_5bea8057797206c034871344d9d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products_tags" ALTER COLUMN "tag_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "products_tags" ALTER COLUMN "product_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "products_tags" DROP CONSTRAINT "PK_cbd06afc39cd795196e15bcc72d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products_tags" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "products_tags" ADD CONSTRAINT "PK_d2adb73cab6259d69fe83a77432" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "products_tags" ADD CONSTRAINT "FK_050fd68b81f130e2eafca1d672d" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products_tags" ADD CONSTRAINT "FK_5bea8057797206c034871344d9d" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
