import { MigrationInterface, QueryRunner } from 'typeorm';

/* Create Payment Methods Table */
export class Migrations1747267292017 implements MigrationInterface {
  name = 'Migrations1747267292017';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "payment_methods" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "is_deleted" boolean NOT NULL DEFAULT false, "name" character varying(255) NOT NULL, "created_by_user_id" integer, "updated_by_user_id" integer, "deleted_by_user_id" integer, CONSTRAINT "UQ_a793d7354d7c3aaf76347ee5a66" UNIQUE ("name"), CONSTRAINT "PK_34f9b8c6dfb4ac3559f7e2820d1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_methods" ADD CONSTRAINT "FK_f6ab518f1ef0ac2ad221399b99b" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_methods" ADD CONSTRAINT "FK_c995cf45dce41c8718be9810faf" FOREIGN KEY ("updated_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_methods" ADD CONSTRAINT "FK_a4878759f6e56ca0bc767bfbfc3" FOREIGN KEY ("deleted_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment_methods" DROP CONSTRAINT "FK_a4878759f6e56ca0bc767bfbfc3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_methods" DROP CONSTRAINT "FK_c995cf45dce41c8718be9810faf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_methods" DROP CONSTRAINT "FK_f6ab518f1ef0ac2ad221399b99b"`,
    );
    await queryRunner.query(`DROP TABLE "payment_methods"`);
  }
}
