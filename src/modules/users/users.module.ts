import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { UserEntity } from './domain/entity/user.entity';
import { UsersRepository } from './infrastructure/users.repository';

const useCases = [];
const adapters = [UsersRepository];

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [UsersService, ...adapters, ...useCases],
  exports: [UsersRepository],
})
export class UsersModule {}
