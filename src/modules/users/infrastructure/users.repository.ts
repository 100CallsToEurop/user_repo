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


  async checkEmailOrLogin(emailOrLogin: string){
    return await this.usersRepository.findOne({
      where: [{ email: emailOrLogin }, { login: emailOrLogin }],
    });
  }

  async createUser(userEntity: UserEntity): Promise<UserEntity> {
    return await this.usersRepository.save(userEntity);
  }

  async getUser(id: string): Promise<UserEntity> {
    return await this.usersRepository.findOneBy({ id });
  }

  async updateUserById(
    id: string,
    updateParams: UserUpdateInputModel,
  ): Promise<void> {
    const user = await this.getUser(id);
    await this.usersRepository.save({
      ...user,
      ...updateParams,
    });
  }
}
