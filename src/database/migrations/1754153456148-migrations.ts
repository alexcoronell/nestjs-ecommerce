import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1754153456148 implements MigrationInterface {
  name = 'Migrations1754153456148';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purchases" DROP CONSTRAINT "FK_e5658a71158651e46027c8fbd9c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchases" ALTER COLUMN "deleted_by_user_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchases" ADD CONSTRAINT "FK_e5658a71158651e46027c8fbd9c" FOREIGN KEY ("deleted_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purchases" DROP CONSTRAINT "FK_e5658a71158651e46027c8fbd9c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchases" ALTER COLUMN "deleted_by_user_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchases" ADD CONSTRAINT "FK_e5658a71158651e46027c8fbd9c" FOREIGN KEY ("deleted_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
