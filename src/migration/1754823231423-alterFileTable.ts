import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterFileTable1754823231423 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "files" RENAME COLUMN "url" TO "path"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "files" RENAME COLUMN "path" TO "url"`
    );
  }
}
