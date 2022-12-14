import { BadRequestException, Injectable } from '@nestjs/common';
import { TokensService } from '../../../../modules/tokens/application/tokens.service';
import { UserInputModel } from '../../../../modules/users/api/model/user.model';
import { UserEntity } from '../../../../modules/users/domain/entity/user.entity';
import { UsersRepository } from '../../../../modules/users/infrastructure/users.repository';
import { AuthService } from '../auth.service';
import { RegistrationViewModel } from '../dto/registration-view-model';
import { UserPayloadForTokenModel } from '../dto/user-payload-fortoken.model';
import { AuthLoginUseCase } from './auth-login.use-case';

@Injectable()
export class AuthRegistrationUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository,
    private readonly authLoginUseCase: AuthLoginUseCase,
  ) {}

  async execute(
    createUserParams: UserInputModel,
  ): Promise<RegistrationViewModel> {
    const checkEmail = await this.authService.checkEmailOrLogin(
      createUserParams.email,
    );
    const checkLogin = await this.authService.checkEmailOrLogin(
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
    
    return await this.authLoginUseCase.execute(payload);
  }
}
