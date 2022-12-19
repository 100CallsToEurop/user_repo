import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersQueryRepository } from 'src/modules/users/api/queryRepository/user.qury.repository';
import { UserPayloadForTokenModel } from '../../application/dto/user-payload-fortoken.model';
import { LoginInputModel } from '../model/login.model';
import { compare } from 'bcrypt';

@Injectable()
export class AuthQueryRepository {
  constructor(
   
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  private async isPasswordCorrect(password: string, hash: string) {
    const isEqual = await compare(password, hash);
    return isEqual;
  }

  async checkCredentails(
    loginParams: LoginInputModel,
  ): Promise<UserPayloadForTokenModel> {
    const user = await this.usersQueryRepository.checkEmailOrLogin(
      loginParams.email,
    );
    if (!user) {
      throw new BadRequestException();
    }
    const isHashedEquals = await this.isPasswordCorrect(
      loginParams.password,
      user.passwordHash,
    );
    if (isHashedEquals) {
      return {
        userId: user.id,
        login: user.login,
      };
    }
    throw new UnauthorizedException();
  }
}
