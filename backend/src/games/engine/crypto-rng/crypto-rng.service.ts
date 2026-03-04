import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptoRngService {
  generateFloat(min: number, max: number): number {
    const randomBytes = crypto.randomBytes(4);
    const randomInt = randomBytes.readUInt32BE(0);

    const normalized = randomInt / 0xffffffff;

    return min + normalized * (max - min);
  }

  generateInt(min: number, max: number): number {
    const randomBytes = crypto.randomBytes(4);
    const randomInt = randomBytes.readUInt32BE(0);

    return min + (randomInt % (max - min + 1));
  }
}
