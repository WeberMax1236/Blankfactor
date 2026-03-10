import { Injectable } from '@nestjs/common'

@Injectable()
export class PayoutService {

  calculate(betAmount: number, multiplier: number): number {
    return betAmount * multiplier
  }

}