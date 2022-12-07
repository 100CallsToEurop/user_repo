import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokensService } from '../../../modules/tokens/application/tokens.service';
import { UserEntity } from '../../../modules/users/domain/entity/user.entity';
import { UserInputModel } from '../../../modules/users/api/model/user.model';
import { UsersRepository } from '../../../modules/users/infrastructure/users.repository';
import { RegistrationViewModel } from './dto/registration-view-model';
import { LoginInputModel } from '../api/model/login.model';
import * as bcrypt from 'bcrypt';
import { SessionsService } from '../../../modules/sessions/application/sessions.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly tokensService: TokensService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async registration(
    createUserParams: UserInputModel,
  ): Promise<RegistrationViewModel> {
    const checkEmail = await this.checkEmailOrLogin(createUserParams.email);
    const checkLogin = await this.checkEmailOrLogin(createUserParams.login);
    if (checkEmail || checkLogin) {
      throw new BadRequestException();
    }

    const newUser = new UserEntity(createUserParams);
    await this.usersRepository.createUser(newUser);

    const userId = newUser.id;
    const tokens = await this.tokensService.createTokens({ userId });
    return tokens;
  }

  async login(loginParams: LoginInputModel): Promise<RegistrationViewModel> {
    const user = await this.checkCredentials(loginParams);
    const userId = user.id;
    const tokens = await this.tokensService.createTokens({ userId });
    await this.usersRepository.updateRefreshToken(userId, tokens.refreshToken);
    return tokens;
  }

  async refresh(token: string): Promise<RegistrationViewModel> {
    const PayloadUserId = await this.tokensService.decodeToken(token);
    await this.checkToken(token);
    const tokens = await this.tokensService.createTokens({ PayloadUserId });
    await this.sessionsService.saveUsedToken(token);
    await this.usersRepository.updateRefreshToken(
      PayloadUserId,
      tokens.refreshToken,
    );
    return tokens;
  }

  async logout(token: string) {
    const PayloadUserId = await this.tokensService.decodeToken(token);
    await this.checkToken(token);
    await this.sessionsService.saveUsedToken(token);
    await this.usersRepository.updateRefreshToken(PayloadUserId, null);
  }

  private async checkToken(token: string): Promise<void> {
    const checkUsedToken = await this.sessionsService.checkUsedToken(token);
    if (checkUsedToken) {
      throw new UnauthorizedException();
    }
  }

  private async checkEmailOrLogin(emailOrLogin: string): Promise<UserEntity> {
    return this.usersRepository.checkEmailOrLogin(emailOrLogin);
  }

  private async checkCredentials(loginParams: LoginInputModel) {
    const user = await this.checkEmailOrLogin(loginParams.email);
    if (!user) {
      throw new BadRequestException();
    }
    const isHashedEquals = await this.isPasswordCorrect(
      loginParams.password,
      user.passwordHash,
    );
    if (isHashedEquals) {
      return user;
    }
    throw new UnauthorizedException();
  }

  private async generateHash(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  private async isPasswordCorrect(password: string, hash: string) {
    const isEqual = await bcrypt.compare(password, hash);
    return isEqual;
  }
}
