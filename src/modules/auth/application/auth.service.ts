import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AddBadTokenUseCase, CreateJWTTokensUseCase, DecodeJWTTokenUseCase, FindBadTokenUseCase } from '../../../modules/tokens/application/useCases';
import { UserEntity } from '../../../modules/users/domain/entity/user.entity';
import { UsersRepository } from '../../../modules/users/infrastructure/users.repository';
import { RegistrationViewModel } from './dto/registration-view-model';
import { UserPayloadForTokenModel } from './dto/user-payload-fortoken.model';


@Injectable()
export class AuthService {
  constructor(
    private readonly findBadTokenUseCase: FindBadTokenUseCase,
    private readonly addBadTokenUseCase: AddBadTokenUseCase,
    private readonly createJWTTokensUseCase: CreateJWTTokensUseCase,
    private readonly decodeJWTTokenUseCase: DecodeJWTTokenUseCase,
    private readonly usersRepository: UsersRepository,
  ) {}

  async checkEmailOrLogin(emailOrLogin: string): Promise<UserEntity> {
    return this.usersRepository.checkEmailOrLogin(emailOrLogin);
  }

  async addBadToken(token: string) {
    return await this.addBadTokenUseCase.execute(token);
  }
  async createJWTTokens(
    payload: UserPayloadForTokenModel,
  ): Promise<RegistrationViewModel> {
    return await this.createJWTTokensUseCase.execute(payload);
  }
  async decodeJWTToken(token: string) {
    return this.decodeJWTTokenUseCase.execute(token);
  }

  async checkBadToken(token: string): Promise<void> {
    const checkUsedToken = await this.findBadTokenUseCase.execute(token);
    if (checkUsedToken) {
      throw new UnauthorizedException();
    }
  }
}
