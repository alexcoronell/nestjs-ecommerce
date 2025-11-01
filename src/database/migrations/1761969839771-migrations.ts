import { MigrationInterface, QueryRunner } from 'typeorm';

/* Slug field added on Brand table */
export class Migrations1761969839771 implements MigrationInterface {
  name = 'Migrations1761969839771';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "brands" ADD "slug" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "brands" ADD CONSTRAINT "UQ_b15428f362be2200922952dc268" UNIQUE ("slug")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "brands" DROP CONSTRAINT "UQ_b15428f362be2200922952dc268"`,
    );
    await queryRunner.query(`ALTER TABLE "brands" DROP COLUMN "slug"`);
  }
}
