import { MigrationInterface, QueryRunner } from 'typeorm';

/* Create Brands Table */
export class Migrations1747182101962 implements MigrationInterface {
  name = 'Migrations1747182101962';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "brands" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "is_deleted" boolean NOT NULL DEFAULT false, "name" character varying(255) NOT NULL, "created_by_user_id" integer, "updated_by_user_id" integer, "deleted_by_user_id" integer, CONSTRAINT "UQ_96db6bbbaa6f23cad26871339b6" UNIQUE ("name"), CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "brands" ADD CONSTRAINT "FK_618ed39ad534f6cefa644d104cc" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "brands" ADD CONSTRAINT "FK_92ef71dcf738469597325e324e6" FOREIGN KEY ("updated_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "brands" ADD CONSTRAINT "FK_c6b5cd98e62566bec93e10bbaae" FOREIGN KEY ("deleted_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "brands" DROP CONSTRAINT "FK_c6b5cd98e62566bec93e10bbaae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "brands" DROP CONSTRAINT "FK_92ef71dcf738469597325e324e6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "brands" DROP CONSTRAINT "FK_618ed39ad534f6cefa644d104cc"`,
    );
    await queryRunner.query(`DROP TABLE "brands"`);
  }
}
