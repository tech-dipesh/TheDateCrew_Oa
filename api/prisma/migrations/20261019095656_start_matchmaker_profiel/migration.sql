-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "Marital" AS ENUM ('NEVER_MARRIED', 'DIVORCED', 'WIDOWED');

-- CreateEnum
CREATE TYPE "Choice" AS ENUM ('YES', 'NO', 'MAYBE');

-- CreateEnum
CREATE TYPE "Stage" AS ENUM ('ONBOARDING', 'VERIFIED', 'MATCHES_SUGGESTED', 'IN_CONVERSATION', 'MEETING_SCHEDULED', 'CLOSED');

-- CreateTable
CREATE TABLE "Matchmaker" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Matchmaker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "heightCm" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "college" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "incomeLpa" INTEGER NOT NULL,
    "company" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "marital" "Marital" NOT NULL,
    "languages" TEXT[],
    "siblings" INTEGER NOT NULL,
    "caste" TEXT NOT NULL,
    "religion" TEXT NOT NULL,
    "wantKids" "Choice" NOT NULL,
    "relocate" "Choice" NOT NULL,
    "pets" "Choice" NOT NULL,
    "stage" "Stage" NOT NULL DEFAULT 'ONBOARDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "matchmakerId" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Matchmaker_username_key" ON "Matchmaker"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_email_key" ON "Profile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_phone_key" ON "Profile"("phone");

-- CreateIndex
CREATE INDEX "Profile_gender_idx" ON "Profile"("gender");

-- CreateIndex
CREATE INDEX "Profile_matchmakerId_idx" ON "Profile"("matchmakerId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_matchmakerId_fkey" FOREIGN KEY ("matchmakerId") REFERENCES "Matchmaker"("id") ON DELETE SET NULL ON UPDATE CASCADE;
