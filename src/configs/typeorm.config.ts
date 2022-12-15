import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { Profile } from '../modules/profiles/domain/entity/profile.entity';
import { BadTokens } from '../modules/tokens/domain/entity/tokens.entity';
import { UserEntity } from '../modules/users/domain/entity/user.entity';

export const TypeOrmConfigService = (): TypeOrmModuleAsyncOptions => ({
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('PG_HOST'),
    port: +configService.get('PG_PORT'),
    username: configService.get('PG_USERNAME'),
    password: configService.get('PG_PASSWORD'),
    database: configService.get('PG_DATABASE'),
    entities: [UserEntity, BadTokens, Profile],
    synchronize: true,
  }),
  inject: [ConfigService],
  imports: [ConfigModule],
});
