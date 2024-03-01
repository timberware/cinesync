import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movie.service';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it.skip('should be defined', () => {
    expect(service).toBeDefined();
  });
});
