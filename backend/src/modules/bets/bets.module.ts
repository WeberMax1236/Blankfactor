import { Module } from '@nestjs/common';
import { BetsController } from './controllers/bets/bets.controller';
import { BetsService } from './services/bets/bets.service';

@Module({
  controllers: [BetsController],
  providers: [BetsService]
})
export class BetsModule {}
