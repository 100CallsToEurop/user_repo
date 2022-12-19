import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensService } from './application/tokens.service';
import {
  AddBadTokenUseCase,
  CreateJWTTokensUseCase,
  DecodeJWTTokenUseCase,
} from './application/useCases';
import { BadTokens } from './domain/entity/tokens.entity';
import { TokensRepository } from './infrastructure/repository/tokens.repository';
import { TokenQueryRepository } from './queryRepository/token.query.repository';

const useCases = [
  CreateJWTTokensUseCase,
  AddBadTokenUseCase,
  DecodeJWTTokenUseCase,
];

const adapters = [TokensRepository, TokenQueryRepository];

@Module({
  imports: [TypeOrmModule.forFeature([BadTokens]), JwtModule],
  providers: [TokensService, ...useCases, ...adapters],
  exports: [...useCases, ...adapters],
})
export class TokensModule {}
