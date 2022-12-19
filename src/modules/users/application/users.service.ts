import { Injectable } from '@nestjs/common';
import { UserUpdateInputModel } from '../api/model/user-update.model';
import { UserInputModel } from '../api/model/user.model';
import { UserEntity } from '../domain/entity/user.entity';
import { UsersRepository } from '../infrastructure/users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository) {}

  async createUser(userParams: UserInputModel): Promise<string> {
    const newUserEntity = new UserEntity(userParams);
    const user = await this.usersRepository.createUser(newUserEntity);
    return user.id
  }


  async updateUserById(
    id: string,
    updateParams: UserUpdateInputModel,
  ): Promise<void> {
    return await this.usersRepository.updateUserById(id, updateParams);
  }

}
