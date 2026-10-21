-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profileId" TEXT NOT NULL,
    "matchmakerId" TEXT NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SentMatch" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerId" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "matchmakerId" TEXT NOT NULL,

    CONSTRAINT "SentMatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Note_profileId_idx" ON "Note"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "SentMatch_customerId_matchId_key" ON "SentMatch"("customerId", "matchId");

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_matchmakerId_fkey" FOREIGN KEY ("matchmakerId") REFERENCES "Matchmaker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SentMatch" ADD CONSTRAINT "SentMatch_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SentMatch" ADD CONSTRAINT "SentMatch_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SentMatch" ADD CONSTRAINT "SentMatch_matchmakerId_fkey" FOREIGN KEY ("matchmakerId") REFERENCES "Matchmaker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
