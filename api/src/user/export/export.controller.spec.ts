import { Test, TestingModule } from '@nestjs/testing';
import { ExportController } from './export.controller';

describe.skip('ExportController', () => {
  let controller: ExportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExportController],
    }).compile();

    controller = module.get<ExportController>(ExportController);
  });

  it.skip('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
