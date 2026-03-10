import { Injectable } from '@nestjs/common'
import { RngService } from '../rng/rng.service'
import { BetValidatorService } from '../bet-validator/bet-validator.service'
import { GameLogic } from '../game.types'

@Injectable()
export class GameEngineService {

  constructor(
    private rng: RngService,
    private validator: BetValidatorService,
  ) {}

  async playGame(balance: number, betAmount: number, logic: GameLogic, betData: any) {

    // validate bet
    this.validator.validate(balance, betAmount)

    // generate random number
    const random = this.rng.float(0, 100)

    // execute game logic
    const result = logic.execute(random, betData)

    return result
  }

}