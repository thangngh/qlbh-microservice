"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const options = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'product-base-db',
    logging: process.env.DB_LOGGING === 'true' || false,
    synchronize: process.env.DB_SYNCHRONIZE === 'true' || false,
    entities: ['dist/**/entities/*.entity{.ts,.js}'],
    migrations: ['dist/database/migrations/*{.ts,.js}'],
};
exports.default = new typeorm_1.DataSource(options);
//# sourceMappingURL=ormConfig.js.map