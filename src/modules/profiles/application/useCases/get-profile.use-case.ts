import { Injectable } from '@nestjs/common';
import { ProfilesRepository } from '../../infrastructure/repository/profiles.repository';

@Injectable()
export class GetProfilesUseCase {
  constructor(private readonly profilesRepository: ProfilesRepository) {}

  async execute(id: string) {
    return await this.profilesRepository.getProfile(id);
  }
}
