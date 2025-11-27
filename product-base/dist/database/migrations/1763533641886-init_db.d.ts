import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class InitDb1763533641886 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
