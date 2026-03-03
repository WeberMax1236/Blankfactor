import { Injectable } from '@nestjs/common'
import * as crypto from 'crypto'

@Injectable()
export class FairnessService {

  /**
   * Generate SHA256 hash
   */
  sha256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex')
  }

  /**
   * Generate game hash
   */
  generateGameHash(
    serverSeed: string,
    clientSeed: string,
    nonce: number,
  ): string {

    const combined = `${serverSeed}:${clientSeed}:${nonce}`

    return this.sha256(combined)
  }

  /**
   * Convert hash to crash multiplier
   * (example crash algorithm)
   */
  crashPoint(hash: string): number {

    const h = parseInt(hash.slice(0, 13), 16)

    const e = Math.pow(2, 52)

    const result = Math.floor((100 * e - h) / (e - h)) / 100

    return Math.max(1, result)
  }

}