import { MigrationInterface, QueryRunner } from 'typeorm';

/* Create customer table - wishlist update with customer relation */
export class Migrations1754776795736 implements MigrationInterface {
  name = 'Migrations1754776795736';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "customers" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "is_deleted" boolean NOT NULL DEFAULT false, "first_name" character varying(255) NOT NULL, "last_name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "phone_number" character varying(255) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "address" character varying(255) NOT NULL, "neighborhood" character varying(255) NOT NULL, CONSTRAINT "UQ_8536b8b85c06969f84f0c098b03" UNIQUE ("email"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist" ADD "customer_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist" ADD CONSTRAINT "UQ_bf540f2e2fdb84a82ba9b65401b" UNIQUE ("customer_id", "product_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist" ADD CONSTRAINT "FK_bf352c755492e9c5b14f36dbaa3" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wishlist" DROP CONSTRAINT "FK_bf352c755492e9c5b14f36dbaa3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist" DROP CONSTRAINT "UQ_bf540f2e2fdb84a82ba9b65401b"`,
    );
    await queryRunner.query(`ALTER TABLE "wishlist" DROP COLUMN "customer_id"`);
    await queryRunner.query(`DROP TABLE "customers"`);
  }
}
