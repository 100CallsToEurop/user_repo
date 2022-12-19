import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesModule } from '../profiles/profiles.module';
import { UsersQueryRepository } from './api/queryRepository/user.qury.repository';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { UserEntity } from './domain/entity/user.entity';
import { UsersRepository } from './infrastructure/users.repository';

const useCases = [];
const adapters = [UsersRepository, UsersQueryRepository];

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), ProfilesModule],
  controllers: [UsersController],
  providers: [UsersService, ...adapters, ...useCases],
  exports: [...adapters],
})
export class UsersModule {}
