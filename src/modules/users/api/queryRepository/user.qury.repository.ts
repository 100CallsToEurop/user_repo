import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserViewModel } from './dto/user-view.model';
import { UserEntity } from '../../domain/entity/user.entity';

@Injectable()
export class UsersQueryRepository {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  private buildResponse(user: UserEntity): UserViewModel {
    return {
      id: user.id,
      email: user.email,
      login: user.login,
      bio: user.bio || '',
    };
  }

  async checkEmailOrLogin(emailOrLogin: string) {
    return await this.usersRepository.findOne({
      where: [{ email: emailOrLogin }, { login: emailOrLogin }],
    });
  }

  async getUser(id: string): Promise<UserEntity> {
    return await this.usersRepository.findOneBy({ id });
  }

  async getUserInfo(id: string): Promise<UserViewModel> {
    const user = await this.usersRepository.findOneBy({ id });
    return this.buildResponse(user);
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
