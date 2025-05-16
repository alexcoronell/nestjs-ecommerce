import { MigrationInterface, QueryRunner } from 'typeorm';

/* Create Store Detail Table */
export class Migrations1747352207060 implements MigrationInterface {
  name = 'Migrations1747352207060';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "store_details" ("id" integer NOT NULL DEFAULT '1', "name" character varying(255), "country" character varying(255), "state" character varying(255), "city" character varying(255), "neighborhood" character varying(255), "address" character varying(255), "phone" character varying(20), "email" character varying(100), "legal_information" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_user_id" integer, "updated_by_user_id" integer, CONSTRAINT "CHK_5e6beef10038d72c7549b4eb10" CHECK ("id" = 1), CONSTRAINT "PK_b41a87303905e09f6fd85641407" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "store_details" ADD CONSTRAINT "FK_84496ff5bbd1d061df9b45297a1" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "store_details" ADD CONSTRAINT "FK_fcfbd816f5d412e97cba432525b" FOREIGN KEY ("updated_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`
            INSERT INTO store_details (
                id
            ) VALUES (
                1
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM store_details WHERE id = 1;
        `);
    await queryRunner.query(
      `ALTER TABLE "store_details" DROP CONSTRAINT "FK_fcfbd816f5d412e97cba432525b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "store_details" DROP CONSTRAINT "FK_84496ff5bbd1d061df9b45297a1"`,
    );
    await queryRunner.query(`DROP TABLE "store_details"`);
  }
}
