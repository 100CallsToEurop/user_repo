import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesController } from './api/profiles.controller';
import { ProfilesService } from './application/profiles.service';
import { GetProfilesUseCase } from './application/useCases/get-profile.use-case';
import { Profile } from './domain/entity/profile.entity';
import { ProfilesRepository } from './infrastructure/repository/profiles.repository';


const useCases = [GetProfilesUseCase];

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  controllers: [ProfilesController],
  providers: [ProfilesService, ProfilesRepository, ...useCases],
  exports: [...useCases],
})
export class ProfilesModule {}
