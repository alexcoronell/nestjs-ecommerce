import { MigrationInterface, QueryRunner } from 'typeorm';

/* Department and City fields added to Customers table */
export class Migrations1757537029943 implements MigrationInterface {
  name = 'Migrations1757537029943';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "department" character varying(100) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "city" character varying(100) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "city"`);
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "department"`);
  }
}
