import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('UserService', () => {
  let userService: UserService;
  let model: Model<User>;

  const mockUserService = {
    create: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  const mockUser = {
    _id: '',
    email: 'coolmirth35@gmail.com',
    username: 'Rhed',
    password: 'password',
  } as any;

  describe('create', () => {
    it('Should create and return a user', async () => {
      const newUser = {
        email: 'coolmirth35@gmail.com',
        username: 'Rhed',
        password: 'password',
      };
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockUser));
      const result = await userService.createNewUser(newUser as any);
      expect(result).toEqual(mockUser);
    });
  });
});
