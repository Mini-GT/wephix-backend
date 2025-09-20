import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find all users', () => {
    expect(controller.findAll()).toStrictEqual([
      { id: 1, name: "user 1", age: 20 }, 
      { id: 2, name: "user 2", age: 10 }, 
      { id: 3, name: "user 3", age: 17 }, 
    ])
  });

});
