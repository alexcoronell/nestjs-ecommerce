import { MigrationInterface, QueryRunner } from 'typeorm';

/* Create Shipment Table */
export class Migrations1754248236573 implements MigrationInterface {
  name = 'Migrations1754248236573';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."shipments_status_enum" AS ENUM('Label Created', 'In Transit', 'Out for Delivery', 'Delivered', 'Attempted Delivery', 'Held at Facility', 'Lost', 'Returned to Sender')`,
    );
    await queryRunner.query(
      `CREATE TABLE "shipments" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "is_deleted" boolean NOT NULL DEFAULT false, "tracking_number" character varying(100) NOT NULL, "shipment_date" TIMESTAMP, "estimated_delivery_date" TIMESTAMP, "status" "public"."shipments_status_enum" NOT NULL DEFAULT 'Label Created', "sale_id" integer, "shipping_company_id" integer, "created_by_user_id" integer, "updated_by_user_id" integer, "deleted_by_user_id" integer, CONSTRAINT "UQ_832ea4b3ec94a18cd3f0e21b9c3" UNIQUE ("sale_id", "shipping_company_id"), CONSTRAINT "PK_6deda4532ac542a93eab214b564" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "shipments" ADD CONSTRAINT "FK_b533d593dd587e21d804e0c581d" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "shipments" ADD CONSTRAINT "FK_5a12eea89dda83ae4c08688f9cf" FOREIGN KEY ("shipping_company_id") REFERENCES "shipping_companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "shipments" ADD CONSTRAINT "FK_26adb813223d773e10fb79a3366" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "shipments" ADD CONSTRAINT "FK_fb9d9cb84f7284e3b95cba6a438" FOREIGN KEY ("updated_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "shipments" ADD CONSTRAINT "FK_895682a559be2bda746e33b4499" FOREIGN KEY ("deleted_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "shipments" DROP CONSTRAINT "FK_895682a559be2bda746e33b4499"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shipments" DROP CONSTRAINT "FK_fb9d9cb84f7284e3b95cba6a438"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shipments" DROP CONSTRAINT "FK_26adb813223d773e10fb79a3366"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shipments" DROP CONSTRAINT "FK_5a12eea89dda83ae4c08688f9cf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shipments" DROP CONSTRAINT "FK_b533d593dd587e21d804e0c581d"`,
    );
    await queryRunner.query(`DROP TABLE "shipments"`);
    await queryRunner.query(`DROP TYPE "public"."shipments_status_enum"`);
  }
}
