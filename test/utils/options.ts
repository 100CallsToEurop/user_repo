import * as dotenv from 'dotenv';
import { SessionsEntity } from '../../src/modules/sessions/domain/entity/session.entity';
import { UserEntity } from '../../src/modules/users/domain/entity/user.entity';
import { DataSourceOptions } from 'typeorm';

dotenv.config({
  path: '.env',
});

export const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.PG_HOST,
  port: +process.env.PG_PORT,
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  entities: [UserEntity, SessionsEntity],
  synchronize: true,
};
