/*
  Warnings:

  - Added the required column `clientSeed` to the `Bet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nonce` to the `Bet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `result` to the `Bet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serverSeedHash` to the `ProvablyFair` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LockReason" AS ENUM ('BET', 'WITHDRAWAL', 'BONUS');

-- AlterTable
ALTER TABLE "Bet" ADD COLUMN     "clientSeed" TEXT NOT NULL,
ADD COLUMN     "nonce" INTEGER NOT NULL,
ADD COLUMN     "result" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProvablyFair" ADD COLUMN     "serverSeedHash" TEXT NOT NULL,
ALTER COLUMN "serverSeed" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Withdrawal" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "processedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "BetResult" (
    "id" TEXT NOT NULL,
    "betId" TEXT NOT NULL,
    "serverSeedHash" TEXT NOT NULL,
    "clientSeed" TEXT NOT NULL,
    "nonce" INTEGER NOT NULL,
    "result" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BetResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WithdrawalQueue" (
    "id" TEXT NOT NULL,
    "withdrawalId" TEXT NOT NULL,
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "reviewed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WithdrawalQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BalanceLock" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "reason" "LockReason" NOT NULL,
    "referenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "released" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BalanceLock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BetResult_betId_key" ON "BetResult"("betId");

-- CreateIndex
CREATE UNIQUE INDEX "WithdrawalQueue_withdrawalId_key" ON "WithdrawalQueue"("withdrawalId");

-- AddForeignKey
ALTER TABLE "BetResult" ADD CONSTRAINT "BetResult_betId_fkey" FOREIGN KEY ("betId") REFERENCES "Bet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WithdrawalQueue" ADD CONSTRAINT "WithdrawalQueue_withdrawalId_fkey" FOREIGN KEY ("withdrawalId") REFERENCES "Withdrawal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BalanceLock" ADD CONSTRAINT "BalanceLock_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
