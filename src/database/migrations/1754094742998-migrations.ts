import { MigrationInterface, QueryRunner } from 'typeorm';

/* Create Purchase Table */
export class Migrations1754094742998 implements MigrationInterface {
  name = 'Migrations1754094742998';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "purchases" ("id" SERIAL NOT NULL, "purchase_date" TIMESTAMP NOT NULL DEFAULT now(), "total_amount" numeric(10,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "is_deleted" boolean NOT NULL DEFAULT false, "created_by_user_id" integer NOT NULL, "updated_by_user_id" integer NOT NULL, "deleted_by_user_id" integer NOT NULL, "supplier_id" integer NOT NULL, CONSTRAINT "PK_1d55032f37a34c6eceacbbca6b8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchases" ADD CONSTRAINT "FK_3d9bbd03998046359d6557f7526" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchases" ADD CONSTRAINT "FK_c77fc82c7f9fd6fbf7c8be66cb9" FOREIGN KEY ("updated_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchases" ADD CONSTRAINT "FK_e5658a71158651e46027c8fbd9c" FOREIGN KEY ("deleted_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchases" ADD CONSTRAINT "FK_d5fec047f705d5b510c19379b95" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purchases" DROP CONSTRAINT "FK_d5fec047f705d5b510c19379b95"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchases" DROP CONSTRAINT "FK_e5658a71158651e46027c8fbd9c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchases" DROP CONSTRAINT "FK_c77fc82c7f9fd6fbf7c8be66cb9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchases" DROP CONSTRAINT "FK_3d9bbd03998046359d6557f7526"`,
    );
    await queryRunner.query(`DROP TABLE "purchases"`);
  }
}
