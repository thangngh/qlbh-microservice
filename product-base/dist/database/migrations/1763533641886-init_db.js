"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitDb1763533641886 = void 0;
class InitDb1763533641886 {
    name = 'InitDb1763533641886';
    async up(queryRunner) {
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
    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE "product_base"
        `);
    }
}
exports.InitDb1763533641886 = InitDb1763533641886;
//# sourceMappingURL=1763533641886-init_db.js.map