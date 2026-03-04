export interface GameResult {
  win: boolean
  payout: number
  result: any
}

export interface GameLogic {
  execute(random: number, betData: any): GameResult
}