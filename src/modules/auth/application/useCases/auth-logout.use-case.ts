import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../../modules/users/infrastructure/users.repository';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthLogoutUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(token: string) {
    await this.authService.checkBadToken(token);
    const { userId } = await this.authService.decodeJWTToken(token);
    await this.usersRepository.updateRefreshToken(userId, null);
    await this.authService.addBadToken(token);
    
  }
}
