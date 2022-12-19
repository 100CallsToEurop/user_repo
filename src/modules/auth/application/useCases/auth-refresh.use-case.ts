import { CommandHandler, ICommandHandler } from '@nestjs/cqrs/dist';
import { AddBadTokenUseCase, DecodeJWTTokenUseCase } from '../../../../modules/tokens/application/useCases';
import { RegistrationViewModel } from '../dto/registration-view-model';
import { AuthLoginUseCase } from './auth-login.use-case';

export class AuthRefreshCommand {
  constructor(public token: string) {}
}

@CommandHandler(AuthRefreshCommand)
export class AuthRefreshUseCase implements ICommandHandler<AuthRefreshCommand> {
  constructor(
    private readonly authLoginUseCase: AuthLoginUseCase,
    private readonly addBadTokenUseCase: AddBadTokenUseCase,
    private readonly decodeJWTTokenUseCase: DecodeJWTTokenUseCase,
  ) {}

  async execute(command: AuthRefreshCommand): Promise<RegistrationViewModel> {
    const { token } = command;
    const { iat, exp, ...payload } = await this.decodeJWTTokenUseCase.execute(
      token,
    );
    const tokens = await this.authLoginUseCase.execute(payload);
    await this.addBadTokenUseCase.execute(token);
    return tokens;
  }
}
