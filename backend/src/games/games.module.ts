import { Module } from '@nestjs/common';
import { RngService } from './engine/rng/rng.service';
import { PayoutService } from './engine/payout/payout.service';
import { BetValidatorService } from './engine/bet-validator/bet-validator.service';
import { GameEngineService } from './engine/game-engine/game-engine.service';
import { CryptoRngService } from './engine/crypto-rng/crypto-rng.service';

@Module({
  providers: [RngService, PayoutService, BetValidatorService, GameEngineService, CryptoRngService]
})
export class GamesModule {}
