import { MigrationInterface, QueryRunner } from 'typeorm';

/* Slug field added on Category table */
export class Migrations1762044649667 implements MigrationInterface {
  name = 'Migrations1762044649667';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "slug" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09"`,
    );
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "slug"`);
  }
}
