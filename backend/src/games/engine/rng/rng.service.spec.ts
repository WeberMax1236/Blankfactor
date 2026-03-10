import { Test, TestingModule } from '@nestjs/testing';
import { RngService } from './rng.service';

describe('RngService', () => {
  let service: RngService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RngService],
    }).compile();

    service = module.get<RngService>(RngService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
