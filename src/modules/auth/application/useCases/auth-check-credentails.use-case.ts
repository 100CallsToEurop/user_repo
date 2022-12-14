import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginInputModel } from "../../api/model/login.model";
import * as bcrypt from 'bcrypt';
import { AuthService } from "../auth.service";
import { UserPayloadForTokenModel } from "../dto/user-payload-fortoken.model";
@Injectable()
export class AuthCheckCredentailsUseCase {
  constructor(private readonly authService: AuthService) {}

  private async isPasswordCorrect(password: string, hash: string) {
    const isEqual = await bcrypt.compare(password, hash);
    return isEqual;
  }

  async execute(
    loginParams: LoginInputModel,
  ): Promise<UserPayloadForTokenModel> {
    const user = await this.authService.checkEmailOrLogin(loginParams.email);
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
        login: user.login
      };
    }
    throw new UnauthorizedException();
  }
}