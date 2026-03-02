import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class ConfirmDepositDto {

  @ApiProperty({ example: "deposit-uuid" })
  @IsUUID()
  depositId: string

}