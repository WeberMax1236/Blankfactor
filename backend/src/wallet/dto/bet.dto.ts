import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsString, Min } from 'class-validator';

export class BetDto {

  @ApiProperty({
    example: 'user-uuid'
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    example: 'wallet-uuid'
  })
  @IsUUID()
  walletId: string;

  @ApiProperty({
    example: 'game-uuid'
  })
  @IsUUID()
  gameId: string;

  @ApiProperty({
    example: 1
  })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    example: 'clientSeed123'
  })
  @IsString()
  clientSeed: string;
}