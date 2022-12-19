import { BadRequestException, } from '@nestjs/common';
import { UsersQueryRepository } from '../../../../modules/users/api/queryRepository/user.qury.repository';
import { UserInputModel } from '../../../../modules/users/api/model/user.model';
import { UserEntity } from '../../../../modules/users/domain/entity/user.entity';
import { UsersRepository } from '../../../../modules/users/infrastructure/users.repository';
import { RegistrationViewModel } from '../dto/registration-view-model';
import { UserPayloadForTokenModel } from '../dto/user-payload-fortoken.model';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs/dist';
import { AuthLoginCommand } from './auth-login.use-case';



export class AuthRegistrationCommand {
  constructor(public createUserParams: UserInputModel) {}
}

@CommandHandler(AuthRegistrationCommand)
export class AuthRegistrationUseCase
  implements ICommandHandler<AuthRegistrationCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(
    command: AuthRegistrationCommand,
  ): Promise<RegistrationViewModel> {
    const { createUserParams } = command;
    const checkEmail = await this.usersQueryRepository.checkEmailOrLogin(
      createUserParams.email,
    );
    const checkLogin = await this.usersQueryRepository.checkEmailOrLogin(
      createUserParams.login,
    );
    if (checkEmail || checkLogin) {
      throw new BadRequestException();
    }

    const newUser = new UserEntity(createUserParams);
    await this.usersRepository.createUser(newUser);

    const payload: UserPayloadForTokenModel = {
      userId: newUser.id,
      login: newUser.login,
    };

    return await this.commandBus.execute(new AuthLoginCommand(payload));
  }
}
