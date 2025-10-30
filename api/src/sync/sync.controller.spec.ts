import { Test, TestingModule } from '@nestjs/testing';
import { SyncController } from './sync.controller';

describe('SyncController', () => {
  let controller: SyncController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SyncController],
    }).compile();

    controller = module.get<SyncController>(SyncController);
  });

  it.skip('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
