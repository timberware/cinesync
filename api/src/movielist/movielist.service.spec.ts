import { Test, TestingModule } from '@nestjs/testing';
import { MovielistService } from './movielist.service';

describe('MovielistService', () => {
  let service: MovielistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovielistService],
    }).compile();

    service = module.get<MovielistService>(MovielistService);
  });

  it.skip('should be defined', () => {
    expect(service).toBeDefined();
  });
});
