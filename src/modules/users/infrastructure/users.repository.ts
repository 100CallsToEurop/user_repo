import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserUpdateInputModel } from '../api/model/user-update.model';
import { UserEntity } from '../domain/entity/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async checkEmailOrLogin(emailOrLogin: string) {
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

  async updateRefreshToken(id: string, token?: string): Promise<void> {
    const currentUser = await this.getUser(id);
    await this.usersRepository.save({
      ...currentUser,
      storageRefreshToken: token ? token : null,
    });
  }

  async getUserAndProfile(id: string) {
   /* return await this.usersRepository.findOne({
      where: { id },
      relations: ['profile'],
    });*/

    return await this.dataSource
      .createQueryBuilder()
      .select('users')
      .from(UserEntity, 'users')
      .innerJoinAndSelect('users.profile', 'profile')
      .where('profile.userId = :userId', { userId: id })
      .getOne();
  }
}
