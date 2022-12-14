import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensService } from './application/tokens.service';
import { AddBadTokenUseCase, CreateJWTTokensUseCase, DecodeJWTTokenUseCase, FindBadTokenUseCase } from './application/useCases';
import { BadTokens } from './domain/entity/tokens.entity';
import { TokensRepository } from './infrastructure/repository/tokens.repository';

const useCases = [
  CreateJWTTokensUseCase,
  AddBadTokenUseCase,
  DecodeJWTTokenUseCase,
  FindBadTokenUseCase,
];

@Module({
  imports: [TypeOrmModule.forFeature([BadTokens]), JwtModule],
  providers: [TokensService, ...useCases, TokensRepository],
  exports: [...useCases],
})
export class TokensModule {}
