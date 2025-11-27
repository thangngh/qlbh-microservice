import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDb1763533641886 implements MigrationInterface {
  name = 'InitDb1763533641886';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "product_base" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "code" character varying(50) NOT NULL,
                "name" character varying(255) NOT NULL,
                "description" character varying(255) NOT NULL,
                "description_thumbnail" character varying(255) NOT NULL,
                "manufacturer" character varying(100) NOT NULL,
                CONSTRAINT "PK_13bac3fda6ce20723dd774c39f0" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "product_base"
        `);
  }
}
