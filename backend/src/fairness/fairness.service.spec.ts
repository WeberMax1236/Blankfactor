import { Test, TestingModule } from '@nestjs/testing';
import { FairnessService } from './fairness.service';

describe('FairnessService', () => {
  let service: FairnessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FairnessService],
    }).compile();

    service = module.get<FairnessService>(FairnessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
