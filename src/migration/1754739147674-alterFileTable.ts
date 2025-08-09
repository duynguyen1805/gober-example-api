import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterFileTable1754739147674 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "files" DROP CONSTRAINT "FK_files_uploaded_by_id"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "files" ADD CONSTRAINT "FK_files_uploaded_by_id" 
      FOREIGN KEY ("uploaded_by_id") REFERENCES "admins"("admin_id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }
}
