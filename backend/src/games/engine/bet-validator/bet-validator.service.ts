import { Injectable, BadRequestException } from '@nestjs/common'

@Injectable()
export class BetValidatorService {

  validate(balance: number, betAmount: number) {

    if (betAmount <= 0) {
      throw new BadRequestException('Invalid bet amount')
    }

    if (balance < betAmount) {
      throw new BadRequestException('Insufficient balance')
    }

  }

}