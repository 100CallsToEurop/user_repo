import { Module } from '@nestjs/common';
import { TypeOrmConfigService } from '../configs/typeorm.config';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TokensModule } from './tokens/tokens.module';
import { AtStrategy } from '../common/strategies/jwt.strategy';
import { RtStrategy } from '../common/strategies/jwt.refresh.strategy';


@Module({
  imports: [
    TypeOrmModule.forRootAsync(TypeOrmConfigService()),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    UsersModule,
    AuthModule,
    TokensModule,
  ],
  controllers: [],
  providers: [AtStrategy, RtStrategy],
})
export class AppModule {}
