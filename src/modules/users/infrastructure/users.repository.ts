import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserUpdateInputModel } from '../api/model/user-update.model';
import { UserEntity } from '../domain/entity/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    
  ) {}

  async createUser(userEntity: UserEntity): Promise<UserEntity> {
    return await this.usersRepository.save(userEntity);
  }

  async updateUserById(
    id: string,
    updateParams: UserUpdateInputModel,
  ): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id });
    await this.usersRepository.save({
      ...user,
      ...updateParams,
    });
  }

  async updateRefreshToken(id: string, token?: string): Promise<void> {
    const currentUser = await this.usersRepository.findOneBy({ id });
    await this.usersRepository.save({
      ...currentUser,
      storageRefreshToken: token ? token : null,
    });
  }

  
}
