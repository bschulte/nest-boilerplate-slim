import * as dotenv from 'dotenv';

dotenv.config();

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/modules/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
};
