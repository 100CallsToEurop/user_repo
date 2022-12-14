import { Module } from '@nestjs/common';
import { TokensModule } from '../tokens/tokens.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import {
  AuthCheckCredentailsUseCase,
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
  AuthCheckCredentailsUseCase,
];
@Module({
  imports: [UsersModule, TokensModule],
  controllers: [AuthController],
  providers: [AuthService, ...useCases],
})
export class AuthModule {}
