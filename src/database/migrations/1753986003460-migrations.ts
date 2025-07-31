import { MigrationInterface, QueryRunner } from 'typeorm';

/* Remove price column from sale_detail table */
export class Migrations1753986003460 implements MigrationInterface {
  name = 'Migrations1753986003460';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sale_detail" DROP COLUMN "price"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sale_detail" ADD "price" numeric(10,2) NOT NULL`,
    );
  }
}
