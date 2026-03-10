import { Injectable } from '@nestjs/common'
import { CryptoRngService } from '../crypto-rng/crypto-rng.service'

@Injectable()
export class RngService {

  constructor(private crypto: CryptoRngService) {}

  float(min: number, max: number): number {
    return this.crypto.generateFloat(min, max)
  }

  int(min: number, max: number): number {
    return this.crypto.generateInt(min, max)
  }

}