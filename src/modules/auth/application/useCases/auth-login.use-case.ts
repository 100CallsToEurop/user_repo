import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs/dist';
import { CreateJWTTokensUseCase } from '../../../../modules/tokens/application/useCases';
import { UsersRepository } from '../../../../modules/users/infrastructure/users.repository';
import { RegistrationViewModel } from '../dto/registration-view-model';
import { UserPayloadForTokenModel } from '../dto/user-payload-fortoken.model';

export class AuthLoginCommand {
  constructor(public payload: UserPayloadForTokenModel) {}
}
@CommandHandler(AuthLoginCommand)
export class AuthLoginUseCase implements ICommandHandler<AuthLoginCommand> {
  constructor(
    private readonly createJWTTokensUseCase: CreateJWTTokensUseCase,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(command: AuthLoginCommand): Promise<RegistrationViewModel> {
    const { payload } = command;
    const tokens = await this.createJWTTokensUseCase.execute(payload);
    await this.usersRepository.updateRefreshToken(
      payload.userId,
      tokens.refreshToken,
    );
    return tokens;
  }
}
