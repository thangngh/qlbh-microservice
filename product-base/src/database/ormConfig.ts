import { DataSource, DataSourceOptions } from 'typeorm';

const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT as string, 10) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: (process.env.DB_PASSWORD as string) || 'password',
  database: process.env.DB_NAME || 'product-base-db',
  logging: process.env.DB_LOGGING === 'true' || false,
  synchronize: process.env.DB_SYNCHRONIZE === 'true' || false,
  entities: ['dist/**/entities/*.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/*{.ts,.js}'],
};

export default new DataSource(options);
