import { Test, TestingModule } from '@nestjs/testing';
import { ApikeysController } from './apikeys.controller';

describe('ApikeysController', () => {
  let controller: ApikeysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApikeysController],
    }).compile();

    controller = module.get<ApikeysController>(ApikeysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
