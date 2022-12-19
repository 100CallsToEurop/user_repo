import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs/dist';
import {
  AddBadTokenUseCase,
  DecodeJWTTokenUseCase,
} from '../../../../modules/tokens/application/useCases';
import { UsersRepository } from '../../../../modules/users/infrastructure/users.repository';

export class AuthLogoutCommand {
  constructor(public token: string) {}
}

@CommandHandler(AuthLogoutCommand)
export class AuthLogoutUseCase implements ICommandHandler<AuthLogoutCommand> {
  constructor(
    private readonly addBadTokenUseCase: AddBadTokenUseCase,
    private readonly decodeJWTTokenUseCase: DecodeJWTTokenUseCase,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(command: AuthLogoutCommand) {
    const { token } = command;
    const { userId } = await this.decodeJWTTokenUseCase.execute(token);
    await this.usersRepository.updateRefreshToken(userId, null);
    await this.addBadTokenUseCase.execute(token);
  }
}
