import * as dotenv from 'dotenv';
import { UserEntity } from '../../src/modules/users/domain/entity/user.entity';
import { DataSourceOptions } from 'typeorm';
import { BadTokens } from '../../src/modules/tokens/domain/entity/tokens.entity';

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
  entities: [UserEntity, BadTokens],
  synchronize: true,
};
