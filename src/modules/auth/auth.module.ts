import { Module } from '@nestjs/common';
import { SessionsModule } from '../sessions/sessions.module';
import { TokensModule } from '../tokens/tokens.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';

@Module({
  imports: [UsersModule, TokensModule, SessionsModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
