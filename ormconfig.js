// eslint-disable-next-line
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/modules/**/*.entity{.ts,.js}'],
  subscribers: ['dist/modules/**/*.subscriber{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsRun: true,
};
