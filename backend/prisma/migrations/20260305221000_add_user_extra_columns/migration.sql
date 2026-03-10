-- CreateTable UserLevel (required by User.levelId)
CREATE TABLE "UserLevel" (
    "id" SERIAL NOT NULL,
    "level" INTEGER NOT NULL,
    "xpRequired" INTEGER NOT NULL,
    "rewardMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,

    CONSTRAINT "UserLevel_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserLevel_level_key" ON "UserLevel"("level");

-- AlterTable User: add missing columns (schema had these; initial migration did not)
ALTER TABLE "User" ADD COLUMN "phone" TEXT;
ALTER TABLE "User" ADD COLUMN "xp" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "levelId" INTEGER;
ALTER TABLE "User" ADD COLUMN "referralCode" TEXT;
ALTER TABLE "User" ADD COLUMN "referrerId" TEXT;

-- Make email and passwordHash nullable (schema has String?)
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL;
ALTER TABLE "User" ALTER COLUMN "passwordHash" DROP NOT NULL;

-- Unique indexes for new columns
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");

-- Foreign key User.referrerId -> User(id)
ALTER TABLE "User" ADD CONSTRAINT "User_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Foreign key User.levelId -> UserLevel(id)
ALTER TABLE "User" ADD CONSTRAINT "User_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "UserLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
