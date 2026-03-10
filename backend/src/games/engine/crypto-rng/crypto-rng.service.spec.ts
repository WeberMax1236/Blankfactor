import { Test, TestingModule } from '@nestjs/testing';
import { CryptoRngService } from './crypto-rng.service';

describe('CryptoRngService', () => {
  let service: CryptoRngService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoRngService],
    }).compile();

    service = module.get<CryptoRngService>(CryptoRngService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
