import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { RegistrationViewModel } from '../dto/registration-view-model';
import { AuthLoginUseCase } from './auth-login.use-case';

@Injectable()
export class AuthRefreshUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly authLoginUseCase: AuthLoginUseCase,
  ) {}

  async execute(token: string): Promise<RegistrationViewModel> {
    await this.authService.checkBadToken(token);
    const { iat, exp, ...payload } = await this.authService.decodeJWTToken(
      token,
    );
    const tokens = await this.authLoginUseCase.execute(payload);
    await this.authService.addBadToken(token);
    return tokens;
  }
}
