import { MigrationInterface, QueryRunner } from "typeorm"

const schemaName = 'auth';
export class CreateAuthSchema1684357380321 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createSchema(schemaName, true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropSchema(schemaName, true, true);
    }

}
