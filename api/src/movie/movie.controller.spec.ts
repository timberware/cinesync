import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movie.controller';

describe('MoviesController', () => {
  let controller: MoviesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
  });

  it.skip('should be defined', () => {
    expect(controller).toBeDefined();
  });
});