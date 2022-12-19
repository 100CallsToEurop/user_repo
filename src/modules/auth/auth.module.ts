import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TokensModule } from '../tokens/tokens.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './api/auth.controller';
import { AuthQueryRepository } from './api/queryRepository/auth.query.repository';
import { AuthService } from './application/auth.service';
import {
  AuthLoginUseCase,
  AuthLogoutUseCase,
  AuthRefreshUseCase,
  AuthRegistrationUseCase,
} from './application/useCases';

const useCases = [
  AuthLogoutUseCase,
  AuthLoginUseCase,
  AuthRefreshUseCase,
  AuthRegistrationUseCase,
];

const adapter = [AuthQueryRepository];
@Module({
  imports: [UsersModule, TokensModule, CqrsModule],
  controllers: [AuthController],
  providers: [AuthService, ...useCases, ...adapter],
})
export class AuthModule {}
