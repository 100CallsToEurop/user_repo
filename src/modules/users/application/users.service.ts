import { Injectable } from '@nestjs/common';
import { UserUpdateInputModel } from '../api/model/user-update.model';
import { UserInputModel } from '../api/model/user.model';
import { UserEntity } from '../domain/entity/user.entity';
import { UsersRepository } from '../infrastructure/users.repository';
import { UserViewModel } from './dto/user-view.model';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository) {}

  private buildResponse(user: UserEntity): UserViewModel {
    return {
      id: user.id,
      email: user.email,
      login: user.login,
      bio: user.bio || '',
    };
  }

  async createUser(userParams: UserInputModel): Promise<UserViewModel> {
    const newUserEntity = new UserEntity(userParams);
    const user = await this.usersRepository.createUser(newUserEntity);
    return this.buildResponse(user);
  }

  async getUser(id: string): Promise<UserViewModel> {
    const user = await this.usersRepository.getUser(id);
    return this.buildResponse(user);
  }

  async updateUserById(
    id: string,
    updateParams: UserUpdateInputModel,
  ): Promise<void> {
    return await this.usersRepository.updateUserById(id, updateParams);
  }
}
