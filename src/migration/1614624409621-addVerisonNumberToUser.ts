import { MigrationInterface, QueryRunner } from 'typeorm';

export class addVerisonNumberToUser1614624409621 implements MigrationInterface {
    name = 'addVerisonNumberToUser1614624409621';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "tokenVersion" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "tokenVersion"`);
    }
}
