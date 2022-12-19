import { Test, TestingModule } from '@nestjs/testing';
import { UserInputModel } from '../api/model/user.model';
import { UserEntity } from '../domain/entity/user.entity';
import { UsersRepository } from '../infrastructure/users.repository';
import { UserViewModel } from '../api/queryRepository/dto/user-view.model';
import { UsersService } from './users.service';
import { v4 as uuidv4 } from 'uuid';
import { UserUpdateInputModel } from '../api/model/user-update.model';

describe('test UserService', () => {
  const createNewUser: UserInputModel = {
    email: 'test1@mail.ru;',
    login: 'testic;',
    bio: 'sdadasdasd',
    password: '12345',
  };

  const mockUsersRepository = {
    createUser: jest.fn().mockImplementation((userEntity: UserEntity) => {
      return {
        id: uuidv4(),
        email: 'test1@mail.ru;',
        login: 'testic;',
        bio: 'sdadasdasd',
      };
    }),

    getUser: jest.fn().mockImplementation((id: string) => {
      return {
        id,
        email: 'test1@mail.ru;',
        login: 'testic;',
        bio: 'sdadasdasd',
      };
    }),

    updateUserById: jest
      .fn()
      .mockImplementation((id: string, updateParams: UserUpdateInputModel) => {
        return {
          id,
          email: 'test1@mail.ru;',
          login: 'testic;',
          bio: updateParams.bio,
        };
      }),
  };

  let userService: UsersService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should return new user', async () => {
    const result = await userService.createUser(createNewUser);
    expect(result).toEqual({
      id: expect.any(String),
      email: 'test1@mail.ru;',
      login: 'testic;',
      bio: 'sdadasdasd',
    });

    const userId = result.id;
    const getUser = await userService.getUser(userId);
    expect(getUser).toEqual({
      id: expect.any(String),
      email: 'test1@mail.ru;',
      login: 'testic;',
      bio: 'sdadasdasd',
    });

    const updateUser = await userService.updateUserById(userId, {
      bio: 'dsffsdfs',
    });

    expect(updateUser).toEqual({
      id: expect.any(String),
      email: 'test1@mail.ru;',
      login: 'testic;',
      bio: 'dsffsdfs',
    });
  });
});
