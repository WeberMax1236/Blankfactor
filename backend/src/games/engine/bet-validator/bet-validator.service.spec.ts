import { Test, TestingModule } from '@nestjs/testing';
import { BetValidatorService } from './bet-validator.service';

describe('BetValidatorService', () => {
  let service: BetValidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BetValidatorService],
    }).compile();

    service = module.get<BetValidatorService>(BetValidatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
