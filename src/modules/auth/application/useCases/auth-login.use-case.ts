import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../../modules/users/infrastructure/users.repository';
import { AuthService } from '../auth.service';
import { RegistrationViewModel } from '../dto/registration-view-model';
import { UserPayloadForTokenModel } from '../dto/user-payload-fortoken.model';

@Injectable()
export class AuthLoginUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(
    payload: UserPayloadForTokenModel,
  ): Promise<RegistrationViewModel> {

    const tokens = await this.authService.createJWTTokens(payload);
    await this.usersRepository.updateRefreshToken(payload.userId, tokens.refreshToken);
    return tokens;
  }
}
