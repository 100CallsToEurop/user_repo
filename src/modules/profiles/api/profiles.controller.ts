import { Controller, Get, Param } from '@nestjs/common';
import { GetProfilesUseCase } from '../application/useCases/get-profile.use-case';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly getProfilesUseCase: GetProfilesUseCase) {}

  @Get(':id')
  async getProfile(@Param('id') id: string) {
    return await this.getProfilesUseCase.execute(id);
  }
}
